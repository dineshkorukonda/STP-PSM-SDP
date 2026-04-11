# STP-PSM-SDP

Monorepo for the SmartPass-style Next.js app in **`my-app/`**.

## Local database and auth

The app uses **PostgreSQL** directly (via `pg` on the server) and **cookie sessions** signed with **`AUTH_SECRET`**.

### Setup

1. Install and start PostgreSQL. Set **`DATABASE_URL`** to a user that exists in your cluster (on many Mac/Homebrew installs the user is your macOS login, not `postgres`; see **`my-app/.env.local.example`**).
2. From **`my-app/`**, apply the schema:

   ```bash
   psql "$DATABASE_URL" -f db/schema.sql
   ```

3. Copy **`my-app/.env.local.example`** to **`my-app/.env.local`**. Set **`DATABASE_URL`**, **`AUTH_SECRET`** (at least 32 characters), and **`NEXT_PUBLIC_APP_URL`** (use your public or LAN URL so QR codes work from phones).
4. Run the app:

   ```bash
   cd my-app && npm run dev
   ```

### Remote / hosted PostgreSQL

Use the connection string from your provider as **`DATABASE_URL`** (often includes `?sslmode=require`). If the URL does not enable TLS but your host requires it, set **`DATABASE_SSL=true`**. For providers with custom CAs, you may need **`DATABASE_SSL_REJECT_UNAUTHORIZED=false`** (weaker trust; prefer supplying the CA). Optional **`DATABASE_POOL_MAX`** caps the connection pool size (default 10).

Sign up stores a **bcrypt** hash; sign in sets an **httpOnly** session cookie.

More detail: **[my-app/db/README.md](my-app/db/README.md)**.
