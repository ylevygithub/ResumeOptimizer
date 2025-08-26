'use client';
import { useState } from 'react';
import Paywall from './Paywall';

type Result = {
  profileSummary: string;
  atsKeywords: string[];
  bulletPoints: string[];
  coverLetter: string;
  remainingRuns?: number;
  paywalled?: boolean;
};

export default function Editor({ hasSub, initialRuns }: { hasSub: boolean; initialRuns: number }) {
  const [cv, setCv] = useState('');
  const [offer, setOffer] = useState('');
  const [res, setRes] = useState<Result | null>(null);
  const [runsLeft, setRunsLeft] = useState(initialRuns);
  const [loading, setLoading] = useState(false);
  const paywalled = !hasSub && runsLeft <= 0;

  async function optimize() {
    setLoading(true);
    const r = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ cv, offer })
    });
    const data = await r.json();
    setLoading(false);
    setRes(data);
    if (typeof data.remainingRuns === 'number') setRunsLeft(data.remainingRuns);
  }

  return (
    <div className="grid gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <textarea className="h-64 w-full rounded-xl border p-3" placeholder="Collez votre CV (texte)"
          value={cv} onChange={(e) => setCv(e.target.value)} />
        <textarea className="h-64 w-full rounded-xl border p-3" placeholder="Collez l'offre d'emploi"
          value={offer} onChange={(e) => setOffer(e.target.value)} />
      </div>
      <div className="flex items-center justify-between">
        <button onClick={optimize} disabled={loading || paywalled || !cv || !offer}
          className="rounded-xl bg-black text-white px-5 py-2">{loading ? 'Optimizing…' : 'Optimize'}</button>
        <span className="text-sm text-neutral-600">
          {hasSub ? 'Pro: unlimited' : `Free runs left: ${runsLeft}`}
        </span>
      </div>

      {paywalled && <Paywall />}

      {res && !paywalled && (
        <div className="rounded-2xl bg-white p-5 shadow grid gap-4">
          <section>
            <h3 className="font-semibold mb-2">Profile Summary</h3>
            <p className="whitespace-pre-wrap">{res.profileSummary}</p>
          </section>
          <section>
            <h3 className="font-semibold mb-2">ATS Keywords</h3>
            <ul className="list-disc pl-5">{res.atsKeywords.map((k,i)=><li key={i}>{k}</li>)}</ul>
          </section>
          <section>
            <h3 className="font-semibold mb-2">Bullet Points</h3>
            <ul className="list-disc pl-5">{res.bulletPoints.map((b,i)=><li key={i}>{b}</li>)}</ul>
          </section>
          <section>
            <h3 className="font-semibold mb-2">Cover Letter (FR)</h3>
            <p className="whitespace-pre-wrap">{res.coverLetter}</p>
          </section>
        </div>
      )}
    </div>
  );
}
