import { NextResponse } from 'next/server';
import { toMarketplaceListing } from '../../../lib/listing-mapper';
import {
  detectImageType,
  IMAGE_MAX_BYTES,
  IMAGE_MAX_COUNT,
  isListingCategory,
  isValidEmail,
} from '../../../lib/marketplace-validation';
import { getSupabaseClient } from '../../../lib/supabase';
import type { ListingRow } from '../../../types/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function categoryOptions(filter: string): string[] | null {
  const normalized = filter.trim().toLowerCase();
  if (!normalized || normalized === 'all items') return [];
  if (normalized === 'electronics') return ['Electronics & Computers'];
  if (normalized === 'vehicles') return ['Vehicles & Parts'];
  if (normalized === 'clothing' || normalized === 'apparel') {
    return ['Clothing & Shoes'];
  }
  if (normalized === 'sports & outdoors') {
    return ['Sporting Goods', 'Bicycles & Accessories'];
  }
  if (normalized === 'other') return ['Hobbies & Toys'];
  if (['property', 'property rentals', 'books'].includes(normalized)) {
    return [];
  }
  return isListingCategory(filter) ? [filter] : null;
}

export async function GET(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase is not configured. Add the Supabase URL and public key to the environment.' },
      { status: 503 }
    );
  }

  const params = new URL(request.url).searchParams;
  const query = params.get('q')?.trim().toLocaleLowerCase() ?? '';
  const category = params.get('category')?.trim();
  let requestQuery = supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (category) {
    const categories = categoryOptions(category);
    if (categories === null) {
      return NextResponse.json({ error: 'Choose a valid listing category.' }, { status: 400 });
    }
    if (categories.length === 0) return NextResponse.json([]);
    if (categories.length === 1) requestQuery = requestQuery.eq('category', categories[0]);
    if (categories.length > 1) requestQuery = requestQuery.in('category', categories);
  }

  const { data, error } = await requestQuery;
  if (error) {
    return NextResponse.json({ error: 'Listings could not be loaded.' }, { status: 500 });
  }

  const rows = (data ?? []) as ListingRow[];
  const filtered = query
    ? rows.filter((row) =>
        `${row.title} ${row.description} ${row.category} ${row.location}`
          .toLocaleLowerCase()
          .includes(query)
      )
    : rows;

  return NextResponse.json(filtered.map(toMarketplaceListing));
}

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase is not configured. Add the Supabase URL and public key to the environment.' },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Submit the listing as a multipart form.' }, { status: 400 });
  }

  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const sellerEmail = String(formData.get('seller_email') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim();
  const location = String(formData.get('location') ?? '').trim();
  const condition = String(formData.get('condition') ?? '').trim();
  const priceText = String(formData.get('price') ?? '').trim();
  const price = Number(priceText);

  if (!title || title.length > 120) {
    return NextResponse.json({ error: 'Enter a title between 1 and 120 characters.' }, { status: 400 });
  }
  if (!description || description.length > 5000) {
    return NextResponse.json({ error: 'Enter a description between 1 and 5000 characters.' }, { status: 400 });
  }
  if (!priceText || !Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: 'Price must be a valid number greater than or equal to zero.' }, { status: 400 });
  }
  if (!isValidEmail(sellerEmail)) {
    return NextResponse.json({ error: 'Enter a valid seller email address.' }, { status: 400 });
  }
  if (!isListingCategory(category)) {
    return NextResponse.json({ error: 'Choose a valid listing category.' }, { status: 400 });
  }
  if (location.length > 160) {
    return NextResponse.json({ error: 'Location must be 160 characters or fewer.' }, { status: 400 });
  }
  if (!['New', 'Like New', 'Good', 'Fair'].includes(condition)) {
    return NextResponse.json({ error: 'Choose a valid item condition.' }, { status: 400 });
  }

  const imageEntries = formData.getAll('images');
  if (imageEntries.length === 0 || imageEntries.length > IMAGE_MAX_COUNT) {
    return NextResponse.json({ error: 'Upload between 1 and 10 listing images.' }, { status: 400 });
  }
  if (!imageEntries.every((entry): entry is File => typeof entry !== 'string')) {
    return NextResponse.json({ error: 'Each listing image must be a file.' }, { status: 400 });
  }

  const files = imageEntries as File[];
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > IMAGE_MAX_BYTES * IMAGE_MAX_COUNT) {
    return NextResponse.json({ error: 'The combined image size must be 50MB or less.' }, { status: 400 });
  }

  const uploadedUrls: string[] = [];
  for (const file of files) {
    if (file.size === 0 || file.size > IMAGE_MAX_BYTES) {
      return NextResponse.json({ error: 'Each image must be JPEG, PNG, or WebP and 5MB or smaller.' }, { status: 400 });
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const detectedType = detectImageType(bytes);
    if (!detectedType) {
      const fileName = file.name ? ` "${file.name}"` : '';
      return NextResponse.json({
        error: `The contents of${fileName} are not a supported JPEG, PNG, or WebP image. Try saving or exporting the image as one of those formats.`,
      }, { status: 400 });
    }

    const extension = detectedType === 'image/jpeg' ? 'jpg' : detectedType.slice('image/'.length);
    const objectPath = `${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from('listing-images')
      .upload(objectPath, bytes, {
        cacheControl: '3600',
        contentType: detectedType,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: 'An image could not be uploaded. Check the listing-images bucket setup.' }, { status: 502 });
    }

    uploadedUrls.push(
      supabase.storage.from('listing-images').getPublicUrl(objectPath).data.publicUrl
    );
  }

  const ownerToken = String(formData.get('owner_token') ?? '');
  if (!/^[0-9a-f-]{36}$/i.test(ownerToken)) {
    return NextResponse.json({ error: 'Could not verify listing ownership. Refresh and try again.' }, { status: 400 });
  }

  const { data: listingId, error: createError } = await supabase.rpc('create_listing_with_owner_token', {
    p_title: title,
    p_description: description,
    p_price: price,
    p_seller_email: sellerEmail,
    p_category: category,
    p_image_url: uploadedUrls[0],
    p_image_urls: uploadedUrls,
    p_location: location || 'Local community',
    p_condition: condition,
    p_owner_token: ownerToken,
  });

  if (createError || !listingId) {
    return NextResponse.json({ error: 'The listing could not be saved. Run the latest Supabase SQL setup, then try again.' }, { status: 500 });
  }

  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', listingId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'The listing was saved but could not be loaded.' }, { status: 500 });
  }

  return NextResponse.json({ ...toMarketplaceListing(data as ListingRow), ownerToken }, { status: 201 });
}
