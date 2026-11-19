import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_LISTINGS } from '../src/data/mockListings';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error('Set the Supabase URL and publishable or anon key in .env.local.');
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function databaseCategory(category: string): string {
  if (category === 'Electronics') return 'Electronics & Computers';
  if (category === 'Home Goods' || category === 'Office Supplies') {
    return 'Home & Garden';
  }
  return category;
}

async function seedMockListings() {
  const { data: existing, error: readError } = await supabase
    .from('listings')
    .select('title,seller_email');

  if (readError) {
    throw new Error(`Could not check existing listings (${readError.code}).`);
  }

  const existingKeys = new Set(
    (existing ?? []).map((row) => `${row.title.toLowerCase()}|${row.seller_email.toLowerCase()}`)
  );
  const missing = INITIAL_LISTINGS.filter(
    (listing) =>
      !existingKeys.has(
        `${listing.title.toLowerCase()}|${listing.seller.email.toLowerCase()}`
      )
  );

  if (missing.length === 0) {
    console.log(`All ${INITIAL_LISTINGS.length} mock listings are already in Supabase.`);
    return;
  }

  const { error: insertError } = await supabase.from('listings').insert(
    missing.map((listing) => ({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      seller_email: listing.seller.email,
      category: databaseCategory(listing.category),
      image_url: listing.images[0],
      image_urls: listing.images,
      location: listing.location,
      condition: listing.condition,
      created_at: new Date(Date.now() - listing.listedHoursAgo * 60 * 60 * 1000).toISOString(),
    }))
  );

  if (insertError) {
    throw new Error(`Could not seed mock listings (${insertError.code}).`);
  }

  console.log(`Inserted ${missing.length} mock listings; skipped ${INITIAL_LISTINGS.length - missing.length} existing listings.`);
}

seedMockListings().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Mock listing seed failed.');
  process.exitCode = 1;
});
