import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { isValidEmail } from '../../../lib/marketplace-validation';

export const runtime = 'nodejs';

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
    return errorResponse('Payment configuration is incomplete.', 503);
  }

  let input: { listing_id?: unknown; buyer_email?: unknown };
  try {
    input = (await request.json()) as { listing_id?: unknown; buyer_email?: unknown };
  } catch {
    return errorResponse('A valid purchase request is required.', 400);
  }

  const listingId = typeof input.listing_id === 'string' ? input.listing_id : '';
  const buyerEmail = typeof input.buyer_email === 'string' ? input.buyer_email.trim().toLowerCase() : '';
  if (!listingId || (buyerEmail && !isValidEmail(buyerEmail))) return errorResponse('Enter a valid buyer email address.', 400);

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('id,title,price,status,seller_email')
    .eq('id', listingId)
    .maybeSingle();
  if (listingError || !listing) return errorResponse('This listing could not be found.', 404);
  if (listing.status !== 'active') return errorResponse('This listing has already been sold.', 409);

  const sellerEmail = String(listing.seller_email).trim().toLowerCase();
  const { data: seller, error: sellerError } = await supabase
    .from('seller_stripe_accounts')
    .select('stripe_account_id,onboarding_complete,charges_enabled,payouts_enabled')
    .eq('seller_email', sellerEmail)
    .maybeSingle();
  if (sellerError || !seller?.onboarding_complete || !seller.charges_enabled || !seller.payouts_enabled) {
    return errorResponse('This seller has not completed Stripe onboarding yet.', 409);
  }

  const amountCents = Math.round(Number(listing.price) * 100);
  if (!Number.isFinite(amountCents) || amountCents < 50) return errorResponse('This listing price is too low to purchase.', 400);
  const applicationFee = Math.round(amountCents * 0.1);
  const stripe = new Stripe(stripeSecretKey);
  const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');

  try {
    const order = await supabase.from('orders').insert({
      listing_id: listing.id,
      seller_email: sellerEmail,
      stripe_account_id: seller.stripe_account_id,
      buyer_email: buyerEmail,
      amount: Number(listing.price),
      currency: 'usd',
      application_fee_amount: applicationFee,
    }).select('id').single();
    if (order.error || !order.data) return errorResponse('The order could not be created.', 500);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: String(listing.title) },
          unit_amount: amountCents,
        },
        quantity: 1,
      }],
      ...(buyerEmail ? { customer_email: buyerEmail } : {}),
      payment_intent_data: { application_fee_amount: applicationFee },
      metadata: { order_id: order.data.id, listing_id: listing.id },
      success_url: `${appUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?checkout=cancelled&listing_id=${encodeURIComponent(listing.id)}`,
    }, { stripeAccount: seller.stripe_account_id });

    await supabase.from('orders').update({ stripe_checkout_session_id: session.id }).eq('id', order.data.id);
    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Checkout session creation failed', error);
    return errorResponse('Checkout could not be started.', 502);
  }
}
