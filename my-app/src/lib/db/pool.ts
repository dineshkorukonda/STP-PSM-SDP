import { Pool, type PoolConfig } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString && process.env.NODE_ENV !== "test") {
  console.warn("DATABASE_URL is not set; database routes will fail.");
}

const globalForPool = globalThis as unknown as { __pgPool?: Pool };

function isServerlessRuntime(): boolean {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY ||
      process.env.FUNCTIONS_WORKER_RUNTIME
  );
}

function buildPoolConfig(): PoolConfig {
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL");
  }

  const serverless = isServerlessRuntime();
  const defaultMax = serverless ? 1 : 10;
  const max = Math.min(
    50,
    Math.max(serverless ? 1 : 2, Number(process.env.DATABASE_POOL_MAX || defaultMax))
  );

  const config: PoolConfig = {
    connectionString,
    max,
    idleTimeoutMillis: serverless ? 20_000 : 30_000,
    connectionTimeoutMillis: serverless ? 15_000 : 5000,
  };

  const sslFlag = process.env.DATABASE_SSL;
  const urlSuggestsSsl = /sslmode=(require|verify-full|verify-ca)/i.test(connectionString);
  if (sslFlag === "true" || sslFlag === "1" || urlSuggestsSsl) {
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
