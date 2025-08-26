// import { stripe } from '@/lib/stripe';
// import { NextRequest, NextResponse } from 'next/server';
// import { Webhook } from 'svix'; // not needed; Stripe SDK handles it
// import Stripe from 'stripe';
// import { clerkClient } from '@clerk/nextjs/server';

// /**
//  * After first deploy, set the Stripe webhook to this URL:
//  * https://your-vercel-url.vercel.app/api/stripe/webhook
//  * Events: checkout.session.completed, customer.subscription.created, customer.subscription.updated, customer.subscription.deleted.
//  */

// export const runtime = 'edge'; // or 'nodejs' if using body parsing
// export const preferredRegion = 'home';

// export async function POST(req: NextRequest) {
//   const sig = req.headers.get('stripe-signature')!;
//   const rawBody = await req.text();

//   let event: Stripe.Event;
//   try {
//     event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
//   } catch (err: any) {
//     return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
//   }

//   if (event.type === 'checkout.session.completed' || event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
//     const session = event.data.object as any;
//     const customerId = session.customer as string;
//     const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
//     const email = customer.email!;
//     // find Clerk user by email and set runsLeft to a large number (or marker)
//     const users = await clerkClient.users.getUserList({ emailAddress: [email] });
//     const u = users.data[0];
//     if (u) {
//       await clerkClient.users.updateUser(u.id, {
//         publicMetadata: { ...u.publicMetadata, runsLeft: 9999 }
//       });
//     }
//   }

//   if (event.type === 'customer.subscription.deleted') {
//     const s = event.data.object as Stripe.Subscription;
//     const customer = await stripe.customers.retrieve(s.customer as string) as Stripe.Customer;
//     const email = customer.email!;
//     const users = await clerkClient.users.getUserList({ emailAddress: [email] });
//     const u = users.data[0];
//     if (u) {
//       await clerkClient.users.updateUser(u.id, {
//         publicMetadata: { ...u.publicMetadata, runsLeft: 0 }
//       });
//     }
//   }

//   return NextResponse.json({ received: true });
// }

// export const config = { api: { bodyParser: false } };
