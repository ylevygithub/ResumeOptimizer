import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const { email, user } = await requireUser();
  const success_url = `${process.env.NEXT_PUBLIC_APP_URL}/app`;
  const cancel_url  = `${process.env.NEXT_PUBLIC_APP_URL}/app`;

  // Ensure a customer exists and link by email
  const existing = await stripe.customers.list({ email, limit: 1 });
  const customer = existing.data[0] ?? await stripe.customers.create({
    email, metadata: { clerkUserId: user!.id }
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customer.id,
    line_items: [{ price: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!, quantity: 1 }],
    success_url, cancel_url,
    allow_promotion_codes: true
  });

  return NextResponse.json({ url: session.url });
}
