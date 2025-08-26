import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { hasActiveSub } from '@/lib/billing';
import OpenAI from 'openai';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { z } from 'zod';

const USE_MOCK = process.env.MOCK_AI === '1';

const schema = z.object({
  cv: z.string().min(30),
  offer: z.string().min(30),
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  const { email, user } = await requireUser();
  const body = await req.json();
  const { cv, offer } = schema.parse(body);

  const sub = await hasActiveSub(email);
  const runsLeft = (user!.publicMetadata?.runsLeft as number | undefined) ?? 3;

  if (!sub && runsLeft <= 0) {
    return NextResponse.json({ paywalled: true }, { status: 402 });
  }

  // Prompt
  const sys = `You are a senior French tech recruiter and ATS expert. Output concise, job-tailored resume improvements in French unless the input CV is English.`;
  const userMsg = `
CV (raw):
${cv}

Job offer:
${offer}

Tasks:
1) 4–6 line profile summary.
2) 15–25 ATS keywords (comma-separated).
3) 6–10 bullet points (quantified, STAR-style).
4) Short FR cover letter (8–12 lines).
Ensure alignment with French market conventions.`;

  if (USE_MOCK) {
    const mock = {
      profileSummary: "Développeur full-stack TS/React…",
      atsKeywords: ["TypeScript","React","Node.js","Next.js","CI/CD","AWS"],
      bulletPoints: [
        "Boosté la perf de 42%…",
        "Réduit le coût infra de 30%…"
      ],
      coverLetter: "Madame, Monsieur,…",
      remainingRuns: sub ? runsLeft : Math.max(0, runsLeft - 1),
    };
    if (!sub) {
      clerkClient.users.updateUser(user!.id, {
        publicMetadata: { ...user!.publicMetadata, runsLeft: mock.remainingRuns }
      });
    }
    return NextResponse.json(mock);
  }

  // wrap actual OpenAI call in try/catch:
  let resp;
  try {
    resp = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: userMsg }
        ],
        temperature: 0.5,
    });
  } catch (e: any) {
    if (e.status === 429 || e.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'OPENAI_QUOTA', message: 'Add billing or enable MOCK_AI=1 for dev.' },
        { status: 429 }
      );
    }
    throw e;
  }

  const text = resp.choices[0].message?.content ?? '';

  // very light parsing (sections separated by headings or numbers)
  const profileSummary = text.match(/(Summary|Profil|Profile)[\s\S]*?(?=\n\d|\nATS|Keywords|Mots|$)/i)?.[0] ?? text.split('\n')[0];
  const atsLine = text.match(/(ATS|Keywords|Mots[- ]clés)[:\s]*([\s\S]*?)(?:\n\n|\n\d|\nBullet|$)/i)?.[2] ?? '';
  const atsKeywords = atsLine.split(/,|\n|;/).map(s => s.trim()).filter(Boolean).slice(0, 30);
  const bulletsBlock = text.match(/(Bullets|Réalisations|Points)[\s\S]*?(Cover|Lettre|$)/i)?.[0] ?? '';
  const bulletPoints = bulletsBlock.split('\n').filter(l => /^[-*•]/.test(l)).map(l => l.replace(/^[-*•]\s?/, ''));
  const coverLetter = text.match(/(Cover|Lettre)[\s\S]*$/i)?.[0] ?? '';

  // decrement runs if not subscribed
  let remainingRuns = runsLeft;
  if (!sub) {
    remainingRuns = Math.max(0, runsLeft - 1);
    await clerkClient.users.updateUser(user!.id, {
      publicMetadata: { ...user!.publicMetadata, runsLeft: remainingRuns }
    });
  }

  return NextResponse.json({
    profileSummary, atsKeywords, bulletPoints, coverLetter, remainingRuns
  });
}
