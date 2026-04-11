# Database (local Postgres)

1. Ensure PostgreSQL is running.

2. Create a database if needed: `createdb smartpass` (or use the default `postgres` database).

3. Set `DATABASE_URL` in `my-app/.env.local`.

   The **username in the URL must be a role that exists** in your cluster. If you see `role "postgres" does not exist`, your install likely uses another superuser (on macOS/Homebrew that is often your macOS login name, e.g. `postgresql://myname@localhost:5432/smartpass`).

4. Apply the schema:

   ```bash
   cd my-app
   psql "$DATABASE_URL" -f db/schema.sql
   ```

The app uses server-side `pg` only; the browser never sees `DATABASE_URL`.

### Remote database

Use your provider’s **`DATABASE_URL`**. Many hosts require TLS (`sslmode=require` in the URL). If needed, set **`DATABASE_SSL=true`** in `.env.local` (see **`.env.local.example`**). Tune **`DATABASE_POOL_MAX`** under load.

### `permission denied for table …`

Usually the user in `DATABASE_URL` is not the same role that created the tables. Either:

- Point `DATABASE_URL` at the same user you used to run `schema.sql`, or  
- Re-apply the schema (it ends with `GRANT` statements so all roles can use the tables locally):

 ```bash
  psql "$DATABASE_URL" -f db/schema.sql
  ```
