import { getSupabaseAdminClient } from './supabase-admin';

export async function getOnboardedSellerEmails(): Promise<Set<string>> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return new Set();
  const { data } = await supabase
    .from('seller_stripe_accounts')
    .select('seller_email,onboarding_complete,charges_enabled,payouts_enabled');
  return new Set(
    (data ?? [])
      .filter((seller) => seller.onboarding_complete && seller.charges_enabled && seller.payouts_enabled)
      .map((seller) => String(seller.seller_email).toLowerCase())
  );
}
