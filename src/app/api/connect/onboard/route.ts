import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { isValidEmail } from '../../../../lib/marketplace-validation';

export const runtime = 'nodejs';

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!stripeSecretKey || !supabaseUrl || !serviceKey) return errorResponse('Payment configuration is incomplete.', 503);

  let input: { seller_email?: unknown };
  try {
    input = (await request.json()) as { seller_email?: unknown };
  } catch {
    return errorResponse('A seller email is required.', 400);
  }
  const sellerEmail = typeof input.seller_email === 'string' ? input.seller_email.trim().toLowerCase() : '';
  if (!isValidEmail(sellerEmail)) return errorResponse('Enter a valid seller email address.', 400);

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { count, error: listingError } = await supabase
    .from('listings')
    .select('id', { count: 'exact', head: true })
    .ilike('seller_email', sellerEmail);
  if (listingError) return errorResponse('Seller listings could not be checked.', 500);
  if (!count) return errorResponse('Create a listing with this email before connecting Stripe.', 404);

  const { data: existing, error: existingError } = await supabase
    .from('seller_stripe_accounts')
    .select('stripe_account_id')
    .eq('seller_email', sellerEmail)
    .maybeSingle();
  if (existingError) return errorResponse('Run the latest Supabase Stripe migration first.', 500);

  const stripe = new Stripe(stripeSecretKey);
  try {
    let accountId = existing?.stripe_account_id ?? null;
    if (!accountId) {
      const account = await stripe.accounts.create({
        email: sellerEmail,
        controller: {
          stripe_dashboard: { type: 'express' },
          losses: { payments: 'stripe' },
          fees: { payer: 'application' },
          requirement_collection: 'stripe',
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: { seller_email: sellerEmail },
      });
      accountId = account.id;
      const { error: insertError } = await supabase.from('seller_stripe_accounts').insert({
        seller_email: sellerEmail,
        stripe_account_id: accountId,
      });
      if (insertError) return errorResponse('The Stripe account could not be saved.', 500);
    }

    const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
    const link = await stripe.accountLinks.create({
      account: accountId,
      type: 'account_onboarding',
      refresh_url: `${appUrl}/?stripe=refresh`,
      return_url: `${appUrl}/?stripe=return`,
    });
    return NextResponse.json({ url: link.url });
  } catch (error: unknown) {
    console.error('Stripe Connect onboarding failed', error);
    return errorResponse('Stripe onboarding could not be started.', 502);
  }
}
