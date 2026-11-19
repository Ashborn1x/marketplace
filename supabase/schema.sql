-- Marketplace schema for an anonymous, public marketplace.
-- Run this file in the Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 120),
  description text not null check (char_length(btrim(description)) between 1 and 5000),
  price numeric(12, 2) not null check (price >= 0),
  seller_email text not null check (
    char_length(seller_email) <= 254 and
    seller_email ~* '^[A-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$'
  ),
  category text not null check (category in (
    'Sporting Goods',
    'Bicycles & Accessories',
    'Electronics & Computers',
    'Vehicles & Parts',
    'Home & Garden',
    'Clothing & Shoes',
    'Hobbies & Toys'
  )),
  image_url text not null check (char_length(btrim(image_url)) > 0),
  image_urls text[] not null default '{}',
  location text not null default 'Local community'
    check (char_length(btrim(location)) between 1 and 160),
  condition text not null default 'Good'
    check (condition in ('New', 'Like New', 'Good', 'Fair')),
  created_at timestamptz not null default now()
);

create index if not exists listings_created_at_idx
  on public.listings (created_at desc);
create index if not exists listings_category_created_at_idx
  on public.listings (category, created_at desc);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_email text not null check (
    char_length(buyer_email) <= 254 and
    buyer_email ~* '^[A-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$'
  ),
  message text not null check (char_length(btrim(message)) between 1 and 5000),
  created_at timestamptz not null default now()
);

create index if not exists messages_listing_id_created_at_idx
  on public.messages (listing_id, created_at desc);

-- Anonymous ownership is represented by a random token held by the creator's
-- browser. Only a SHA-256 hash is stored, and clients cannot read this table.
create table if not exists public.listing_owner_tokens (
  listing_id uuid primary key references public.listings(id) on delete cascade,
  token_hash text not null
);
alter table public.listing_owner_tokens enable row level security;
revoke all on table public.listing_owner_tokens from public, anon, authenticated;

create or replace function public.create_listing_with_owner_token(
  p_title text,
  p_description text,
  p_price numeric,
  p_seller_email text,
  p_category text,
  p_image_url text,
  p_image_urls text[],
  p_location text,
  p_condition text,
  p_owner_token text
) returns uuid
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  new_listing_id uuid;
begin
  if p_owner_token is null or length(p_owner_token) < 32 then
    raise exception 'Invalid listing owner token';
  end if;

  insert into public.listings (
    title, description, price, seller_email, category, image_url,
    image_urls, location, condition
  ) values (
    p_title, p_description, p_price, p_seller_email, p_category, p_image_url,
    coalesce(p_image_urls, array[]::text[]), p_location, p_condition
  ) returning id into new_listing_id;

  insert into public.listing_owner_tokens (listing_id, token_hash)
  values (new_listing_id, encode(digest(p_owner_token, 'sha256'), 'hex'));

  return new_listing_id;
end;
$$;

create or replace function public.delete_listing_if_owner(
  p_listing_id uuid,
  p_owner_token text
) returns boolean
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  expected_hash text;
  image_names text[];
begin
  if p_owner_token is null or length(p_owner_token) < 32 then
    return false;
  end if;

  select token_hash into expected_hash
  from public.listing_owner_tokens
  where listing_id = p_listing_id;

  if expected_hash is null or expected_hash <> encode(digest(p_owner_token, 'sha256'), 'hex') then
    return false;
  end if;

  select array_agg(distinct split_part(imgs.url, '/listing-images/', 2))
    into image_names
  from public.listings l
  cross join lateral unnest(coalesce(l.image_urls, array[]::text[]) || array[l.image_url]) as imgs(url)
  where l.id = p_listing_id
    and imgs.url like '%/listing-images/%';

  delete from storage.objects
  where bucket_id = 'listing-images'
    and name = any(coalesce(image_names, array[]::text[]))
    and name ~ '^[0-9a-f-]+\.(jpg|jpeg|png|webp)$';

  delete from public.listings where id = p_listing_id;
  return found;
end;
$$;

revoke all on function public.create_listing_with_owner_token(text, text, numeric, text, text, text, text[], text, text, text) from public, authenticated;
grant execute on function public.create_listing_with_owner_token(text, text, numeric, text, text, text, text[], text, text, text) to anon;
revoke all on function public.delete_listing_if_owner(uuid, text) from public, authenticated;
grant execute on function public.delete_listing_if_owner(uuid, text) to anon;

alter table public.listings enable row level security;
alter table public.messages enable row level security;

revoke all on table public.listings from public, anon, authenticated;
grant select, insert on table public.listings to anon;

revoke all on table public.messages from public, anon, authenticated;
grant insert on table public.messages to anon;

drop policy if exists "Anyone can read listings" on public.listings;
create policy "Anyone can read listings"
  on public.listings for select to anon
  using (true);

drop policy if exists "Anyone can create listings" on public.listings;
create policy "Anyone can create listings"
  on public.listings for insert to anon
  with check (true);

drop policy if exists "Anyone can submit messages" on public.messages;
create policy "Anyone can submit messages"
  on public.messages for insert to anon
  with check (true);

-- Public image reads are intentional. Uploads are insert-only and scoped to the
-- listing-images bucket. Unique object names plus upsert=false prevent overwrites.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'listing-images',
  'listing-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

revoke all on table storage.objects from public, anon;
grant select, insert on table storage.objects to anon;

drop policy if exists "Anyone can view listing images" on storage.objects;
create policy "Anyone can view listing images"
  on storage.objects for select to anon
  using (bucket_id = 'listing-images');

drop policy if exists "Anyone can upload listing images" on storage.objects;
create policy "Anyone can upload listing images"
  on storage.objects for insert to anon
  with check (
    bucket_id = 'listing-images' and
    lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
  );
