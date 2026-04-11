import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString && process.env.NODE_ENV !== "test") {
  console.warn("DATABASE_URL is not set; database routes will fail.");
}

const globalForPool = globalThis as unknown as { __pgPool?: Pool };

export function getPool(): Pool {
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL");
  }
  if (!globalForPool.__pgPool) {
    globalForPool.__pgPool = new Pool({ connectionString, max: 10 });
  }
  return globalForPool.__pgPool;
}
