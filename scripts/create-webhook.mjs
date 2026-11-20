import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;
const webhookUrl = process.env.STRIPE_WEBHOOK_URL;

if (!secretKey || !webhookUrl) {
  throw new Error('Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_URL before creating the webhook.');
}

const stripe = new Stripe(secretKey);
const endpoint = await stripe.webhookEndpoints.create({
  url: webhookUrl,
  connect: true,
  enabled_events: ['checkout.session.completed', 'account.updated'],
});

console.log(`Webhook endpoint created: ${endpoint.id}`);
console.log(`Signing secret (save it as STRIPE_WEBHOOK_SECRET): ${endpoint.secret}`);
