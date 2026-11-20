# Supabase setup

1. Open the Supabase project SQL Editor and run [`schema.sql`](./schema.sql).
2. Run [`20261121_test4_stripe_connect.sql`](./migrations/20261121_test4_stripe_connect.sql) after the base schema and listing-owner-token migration.
3. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` plus `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. A legacy anon key can be used with `NEXT_PUBLIC_SUPABASE_ANON_KEY` if the project does not have publishable keys yet.
4. Set `SUPABASE_SERVICE_ROLE_KEY` only in the server/Vercel environment. Never expose it with a `NEXT_PUBLIC_` name or commit it.
5. Set `APP_URL` to the exact application origin used for Stripe Connect and Checkout return URLs.
6. Deploy the app, then set `STRIPE_WEBHOOK_URL=https://YOUR-APP.vercel.app/api/stripe/webhook` and run `node --env-file=.env.local scripts/create-webhook.mjs` once. Save the printed signing secret as `STRIPE_WEBHOOK_SECRET` and redeploy.
7. Restart the Next.js server after changing environment variables.

The app uses only the public anon/publishable key. The SQL grants anonymous visitors read and insert access to listings, insert-only access to messages, and read/upload access to the public `listing-images` bucket. Anonymous users cannot read messages or update/delete listings, messages, or stored files.

Because there are no accounts, anyone can submit listings and messages and can enter an unverified email address. Seller email addresses and listing images are public. Messages are stored privately and are not shown in the app's Inbox because its RLS policy intentionally denies reads. The app does not send email notifications. Anonymous submissions can be spammed; database checks and upload limits validate content but do not identify or rate-limit visitors.

The Test 4 seller flow uses the email address on a listing, as required by the assignment. Buyers remain anonymous. Stripe account linking, Checkout creation, order writes, and webhook updates are performed server-side.
