# Supabase setup (SmartPass)

Auth and data live in **one Supabase project**. There is no separate Neon database in the app code.

## Environment

Add to `my-app/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_anon_key
```

(`NEXT_PUBLIC_SUPABASE_ANON_KEY` is also supported.)

Optional: set **Site URL** and **Redirect URLs** in Supabase Auth settings to include:

- `http://localhost:3000/auth/callback`
- your production URL + `/auth/callback`

## Database

1. Open the Supabase SQL Editor for your project.
2. Run the full contents of `migrations/001_smartpass_supabase.sql`.

This creates:

- `profiles` — linked to `auth.users`, auto-filled on signup via trigger
- `transport_types` — reference data (seeded)
- `passes` — user passes with unique `qr_token` and RLS
- `pass_transport_map` — optional link from pass to transport type
- `get_pass_public(token)` — RPC callable by `anon` for QR verification (safe fields only)

## Clients in code

- Browser: `createClient()` from `@/lib/supabase/client` (uses `@supabase/ssr` `createBrowserClient`)
- Server (Route Handlers, Server Components): `createClient()` from `@/lib/supabase/server`
- Middleware refreshes the auth cookie via `@supabase/ssr` `createServerClient`

## Legacy Neon schema

The older `schema.sql` in this folder described a standalone Postgres layout with a custom `users` table. **Do not mix** that with Supabase Auth—use the migration above instead.