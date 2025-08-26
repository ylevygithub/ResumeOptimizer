import { stripe } from './stripe';

export async function hasActiveSub(email: string) {
  // Small scale: query by customer email
  const customers = await stripe.customers.list({ email, limit: 1 });
  const customer = customers.data[0];
  if (!customer) return false;
  const subs = await stripe.subscriptions.list({ customer: customer.id, status: 'active', limit: 1 });
  return subs.data.length > 0;
}
