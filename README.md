# STP-PSM-SDP

Monorepo for the SmartPass-style Next.js app under **`my-app/`**.

## Local database (Supabase)

The UI uses the **Supabase client** (`@supabase/supabase-js`), which talks to Supabase’s **HTTP API and Auth**, not a raw Postgres URL. For local work, run the **full Supabase stack** (Postgres + PostgREST + Auth, etc.), not only a standalone Postgres instance.

### Prerequisites

- [Docker Desktop](https://docs.docker.com/desktop) running (the Supabase CLI starts services via Docker).

### Setup

From **`my-app/`**:

1. **Start Supabase** — `npm run db:start`  
   - API: `http://127.0.0.1:54321`  
   - Postgres: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`  
   - Studio: `http://127.0.0.1:54323`

2. **Apply schema** — `npm run db:reset` (runs `supabase/migrations` and `seed.sql`).

3. **Environment** — copy `my-app/.env.local.example` to `my-app/.env.local`, or run `npm run db:status` and paste the printed API URL and anon key.

4. **Run the app** — `npm run dev` (in `my-app/`).

Other useful scripts: `npm run db:stop`, `npm run db:status`.

More detail: **[my-app/supabase/README.md](my-app/supabase/README.md)**.

## Hosted Supabase

You can point `my-app/.env.local` at a cloud project instead; see the same Supabase README for required variables and redirect URLs.
