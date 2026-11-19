import { NextResponse } from 'next/server';
import { toMarketplaceListing } from '../../../../lib/listing-mapper';
import { getSupabaseClient } from '../../../../lib/supabase';
import type { ListingRow } from '../../../../types/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: 'This listing ID is invalid.' }, { status: 400 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase is not configured. Add the Supabase URL and public key to the environment.' },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: 'The listing could not be loaded.' }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'This listing could not be found.' }, { status: 404 });
  }

  return NextResponse.json(toMarketplaceListing(data as ListingRow));
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: 'This listing ID is invalid.' }, { status: 400 });
  }

  let body: { ownerToken?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'A listing owner token is required.' }, { status: 400 });
  }
  if (typeof body.ownerToken !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.ownerToken)) {
    return NextResponse.json({ error: 'A valid listing owner token is required.' }, { status: 400 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });
  }

  const { data, error } = await supabase.rpc('delete_listing_if_owner', {
    p_listing_id: id,
    p_owner_token: body.ownerToken,
  });
  if (error) {
    return NextResponse.json({ error: 'The listing could not be deleted. Check the latest Supabase SQL setup.' }, { status: 500 });
  }
  if (data !== true) {
    return NextResponse.json({ error: 'This listing was not created by this browser, or its owner token is unavailable.' }, { status: 403 });
  }
  return NextResponse.json({ success: true });
}
