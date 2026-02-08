import { neon, NeonQueryFunction } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

/**
 * Neon serverless SQL client. Use in Server Components, Route Handlers, or server actions only.
 * Set DATABASE_URL in .env.local (Neon pooled connection string from dashboard).
 *
 * @example
 * const sql = getNeonDb();
 * const users = await sql`SELECT * FROM users WHERE email = ${email}`;
 */
export function getNeonDb(): NeonQueryFunction<false, false> {
  if (!connectionString) {
    throw new Error(
      "Missing DATABASE_URL. Add your Neon connection string to .env.local."
    );
  }
  return neon(connectionString);
}
