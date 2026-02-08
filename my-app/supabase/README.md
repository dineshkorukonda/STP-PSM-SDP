# Database setup

## Supabase

Used for auth / realtime (optional). Already configured via:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

Client: `import { supabase } from "@/lib/supabase/client"` (browser) or `createSupabaseServerClient()` (server).

## Neon (Postgres)

Used for the main app schema (users, passes, transport_types, payments, validation_logs).

### 1. Create a Neon project

At [neon.tech](https://neon.tech), create a project and copy the **pooled** connection string (serverless-friendly).

### 2. Environment

Add to `.env.local`:

```env
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### 3. Run the schema

In the Neon SQL Editor (or any Postgres client connected to your Neon DB), run the contents of `schema.sql` in this folder. That creates:

- `users` – id, name, email, password_hash, role, created_at, updated_at
- `passes` – id, user_id, pass_type, duration_type, start_date, expiry_date, status, qr_token, created_at
- `transport_types` – id, name, is_active, created_at
- `pass_transport_map` – pass_id ↔ transport_type_id (many-to-many)
- `payments` – id, user_id, pass_id, amount, payment_status, transaction_reference, created_at
- `validation_logs` – id, pass_id, transport_type_id, scanned_at, location, validation_status

### 4. Use in code (server-only)

```ts
import { getNeonDb } from "@/lib/db/neon";

const sql = getNeonDb();
const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
```

Types for these tables are in `src/types/db.ts`.
