# STP-PSM-SDP

Monorepo for the SmartPass-style Next.js app in `**my-app/**`.

## Local database and auth

The app uses **PostgreSQL** directly (via `pg` on the server) and **cookie sessions** signed with `AUTH_SECRET` (no Supabase, no Docker required for the DB layer).

### Setup

1. Install and start PostgreSQL. Set `**DATABASE_URL`** to a user that exists in your cluster (on many Mac/Homebrew installs the user is your macOS login, not `postgres`; see `my-app/.env.local.example`).
2. From `**my-app/`**, apply the schema:
  ```bash
   psql "postgresql://postgres:postgres@localhost:5432/postgres" -f db/schema.sql
  ```
3. Copy `**my-app/.env.local.example**` to `**my-app/.env.local**`. Set `**DATABASE_URL**` and a long random `**AUTH_SECRET**` (at least 32 characters).
4. Run the app:
  ```bash
   cd my-app && npm run dev
  ```

Sign up creates a user with a **bcrypt** password hash; sign in sets an **httpOnly** session cookie.

More detail: **[my-app/db/README.md](my-app/db/README.md)**.