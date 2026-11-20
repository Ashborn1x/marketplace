import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../../lib/supabase';

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get('email')?.trim().toLowerCase() ?? '';
  if (!email || !email.includes('@')) {
    return NextResponse.json({ onboarded: false });
  }

  const supabase = getSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

  const { data, error } = await supabase
    .from('seller_stripe_accounts')
    .select('onboarding_complete,charges_enabled,payouts_enabled')
    .eq('seller_email', email)
    .maybeSingle();

  if (error) return NextResponse.json({ onboarded: false });
  return NextResponse.json({
    onboarded: Boolean(data?.onboarding_complete && data.charges_enabled && data.payouts_enabled),
  });
}
