import { NextResponse } from 'next/server';
import { isValidEmail } from '../../../lib/marketplace-validation';
import { getSupabaseClient } from '../../../lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase is not configured. Add the Supabase URL and public key to the environment.' },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Submit a valid message request.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Submit a valid message request.' }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const listingId = typeof input.listing_id === 'string' ? input.listing_id : '';
  const buyerEmail = typeof input.buyer_email === 'string' ? input.buyer_email.trim() : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';

  if (!UUID_PATTERN.test(listingId)) {
    return NextResponse.json({ error: 'This listing ID is invalid.' }, { status: 400 });
  }
  if (!isValidEmail(buyerEmail)) {
    return NextResponse.json({ error: 'Enter a valid buyer email address.' }, { status: 400 });
  }
  if (!message || message.length > 5000) {
    return NextResponse.json({ error: 'Enter a message between 1 and 5000 characters.' }, { status: 400 });
  }

  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('id')
    .eq('id', listingId)
    .maybeSingle();

  if (listingError) {
    return NextResponse.json({ error: 'The listing could not be checked.' }, { status: 500 });
  }
  if (!listing) {
    return NextResponse.json({ error: 'This listing could not be found.' }, { status: 404 });
  }

  const { error } = await supabase.from('messages').insert({
    listing_id: listingId,
    buyer_email: buyerEmail,
    message,
  });

  if (error) {
    return NextResponse.json({ error: 'Your message could not be saved. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
