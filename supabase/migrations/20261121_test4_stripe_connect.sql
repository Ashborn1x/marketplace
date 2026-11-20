-- Test 4: email-based Stripe Connect sellers, orders, and webhook idempotency.
-- Run after the existing marketplace migrations.

alter table public.listings
  add column if not exists status text not null default 'active'
  check (status in ('active', 'sold'));

create table if not exists public.seller_stripe_accounts (
  seller_email text primary key check (seller_email = lower(btrim(seller_email))),
  stripe_account_id text not null unique,
  onboarding_complete boolean not null default false,
  charges_enabled boolean not null default false,
  payouts_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null unique references public.listings(id) on delete restrict,
  seller_email text not null,
  stripe_account_id text not null,
  buyer_email text,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'usd',
  application_fee_amount integer not null check (application_fee_amount >= 0),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'cancelled')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.stripe_webhook_events (
  stripe_event_id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now()
);

create index if not exists orders_seller_email_idx on public.orders (seller_email);
create index if not exists orders_status_idx on public.orders (status);

alter table public.seller_stripe_accounts enable row level security;
alter table public.orders enable row level security;
alter table public.stripe_webhook_events enable row level security;

revoke all on public.seller_stripe_accounts, public.orders, public.stripe_webhook_events from public, anon, authenticated;
