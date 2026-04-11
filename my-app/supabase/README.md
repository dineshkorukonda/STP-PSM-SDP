# Supabase setup (SmartPass)

Auth and data live in **one Supabase project**. There is no separate Neon database in the app code.

## Local development (recommended when avoiding hosted API keys)

Requires [Docker Desktop](https://docs.docker.com/desktop). From `my-app/`:

1. `npm run db:start` — starts Postgres (`postgresql://postgres:postgres@127.0.0.1:54322/postgres`), API at `http://127.0.0.1:54321`, Studio at `http://127.0.0.1:54323`.
2. `npm run db:reset` — applies `migrations/*.sql` and `seed.sql`.
3. Copy `.env.local.example` to `.env.local` (or run `npm run db:status` and paste `API URL` / `anon key`).

If your `config.toml` JWT settings differ from defaults, use the `anon key` from `npm run db:status` instead of the example file.

## Environment (hosted Supabase)

Add to `my-app/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_publishable_or_anon_key
```

(`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are also supported.)

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