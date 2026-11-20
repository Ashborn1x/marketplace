import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const signature = request.headers.get('stripe-signature');
  if (!secret || !webhookSecret || !supabaseUrl || !serviceKey || !signature) {
    return NextResponse.json({ error: 'Webhook configuration is incomplete.' }, { status: 400 });
  }

  const stripe = new Stripe(secret);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error: eventError } = await supabase.from('stripe_webhook_events').insert({
    stripe_event_id: event.id,
    event_type: event.type,
  });
  if (eventError?.code === '23505') return NextResponse.json({ received: true });
  if (eventError) return NextResponse.json({ error: 'Webhook event could not be recorded.' }, { status: 500 });

  if (event.type === 'account.updated') {
    const account = event.data.object as Stripe.Account;
    const email = account.email?.trim().toLowerCase();
    const accountStatus = {
      onboarding_complete: Boolean(account.details_submitted),
      charges_enabled: Boolean(account.charges_enabled),
      payouts_enabled: Boolean(account.payouts_enabled),
    };
    // The endpoint is shared by candidates. Only update accounts created by this app.
    await supabase.from('seller_stripe_accounts').update({
      ...(email ? { seller_email: email } : {}),
      ...accountStatus,
    }).eq('stripe_account_id', account.id);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    const listingId = session.metadata?.listing_id;
    if (orderId && listingId && session.payment_status === 'paid') {
      await supabase.from('orders').update({
        status: 'paid',
        buyer_email: session.customer_details?.email ?? null,
        stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
        paid_at: new Date().toISOString(),
      }).eq('id', orderId).eq('status', 'pending');
      await supabase.from('listings').update({ status: 'sold' }).eq('id', listingId).eq('status', 'active');
    }
  }

  return NextResponse.json({ received: true });
}
