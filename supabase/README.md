# Supabase setup

1. Open the Supabase project SQL Editor and run [`schema.sql`](./schema.sql).
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` plus `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. A legacy anon key can be used with `NEXT_PUBLIC_SUPABASE_ANON_KEY` if the project does not have publishable keys yet.
3. Restart the Next.js server after changing environment variables.

The app uses only the public anon/publishable key. The SQL grants anonymous visitors read and insert access to listings, insert-only access to messages, and read/upload access to the public `listing-images` bucket. Anonymous users cannot read messages or update/delete listings, messages, or stored files.

Because there are no accounts, anyone can submit listings and messages and can enter an unverified email address. Seller email addresses and listing images are public. Messages are stored privately and are not shown in the app's Inbox because its RLS policy intentionally denies reads. The app does not send email notifications. Anonymous submissions can be spammed; database checks and upload limits validate content but do not identify or rate-limit visitors.
