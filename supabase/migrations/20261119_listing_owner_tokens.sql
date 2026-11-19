-- Run after the base schema in the Supabase SQL Editor.
create extension if not exists pgcrypto;

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
