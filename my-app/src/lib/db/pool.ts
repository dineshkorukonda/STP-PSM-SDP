import { Pool, type PoolConfig } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString && process.env.NODE_ENV !== "test") {
  console.warn("DATABASE_URL is not set; database routes will fail.");
}

const globalForPool = globalThis as unknown as { __pgPool?: Pool };

function buildPoolConfig(): PoolConfig {
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL");
  }

  const config: PoolConfig = {
    connectionString,
    max: Math.min(50, Math.max(2, Number(process.env.DATABASE_POOL_MAX || 10))),
  };

  const sslFlag = process.env.DATABASE_SSL;
  if (sslFlag === "true" || sslFlag === "1") {
    config.ssl = {
      rejectUnauthorized:
        process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
    };
  }

  return config;
}

export function getPool(): Pool {
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL");
  }
  if (!globalForPool.__pgPool) {
    globalForPool.__pgPool = new Pool(buildPoolConfig());
  }
  return globalForPool.__pgPool;
}
