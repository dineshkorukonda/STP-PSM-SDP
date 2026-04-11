/** True when the failure is likely transient (network, pool, DB reachability). */
export function isDatabaseConnectivityError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as NodeJS.ErrnoException & { code?: string };
  const c = e.code;
  if (typeof c === "string") {
    if (
      ["ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND", "EAI_AGAIN", "ECONNRESET"].includes(
        c
      )
    ) {
      return true;
    }
    if (/^08/.test(c)) return true;
    if (["57P01", "57P02", "57P03"].includes(c)) return true;
  }
  const msg = e instanceof Error ? e.message.toLowerCase() : "";
  return (
    msg.includes("connection terminated") ||
    msg.includes("connection closed") ||
    msg.includes("server closed the connection") ||
    msg.includes("timeout") ||
    msg.includes("connect econnrefused") ||
    msg.includes("getaddrinfo")
  );
}

function postgresErrorCode(err: unknown): string | undefined {
  if (!err || typeof err !== "object") return undefined;
  const c = (err as { code?: unknown }).code;
  return typeof c === "string" ? c : undefined;
}

export type DescribedDbFailure = {
  status: number;
  error: string;
  debug?: string;
};

/** Maps thrown errors to a safe API response (used by auth and session loaders). */
export function describeServerDbFailure(
  err: unknown,
  options: { fallbackError: string }
): DescribedDbFailure {
  const rawMessage = err instanceof Error ? err.message : String(err);
  const debug =
    process.env.NODE_ENV === "development" ? rawMessage : undefined;

  if (rawMessage.includes("Missing DATABASE_URL")) {
    return {
      status: 503,
      error: "Server is missing DATABASE_URL.",
      debug,
    };
  }
  if (rawMessage.includes("AUTH_SECRET")) {
    return {
      status: 503,
      error: "Server is missing AUTH_SECRET (use at least 32 characters).",
      debug,
    };
  }

  if (isDatabaseConnectivityError(err)) {
    return {
      status: 503,
      error:
        "Database is temporarily unreachable. Check DATABASE_URL, pooling, and DATABASE_SSL on Vercel.",
      debug,
    };
  }

  const msg = rawMessage.toLowerCase();
  if (
    msg.includes("ssl") &&
    (msg.includes("certificate") || msg.includes("cert") || msg.includes("tls"))
  ) {
    return {
      status: 503,
      error:
        "SSL/TLS error talking to Postgres. Set DATABASE_SSL=true or DATABASE_SSL_REJECT_UNAUTHORIZED=false if your provider requires it.",
      debug,
    };
  }

  const pgCode = postgresErrorCode(err);
  if (pgCode === "42P01") {
    return {
      status: 503,
      error:
        "Database tables are missing. Run db/schema.sql against the DATABASE_URL database on Vercel.",
      debug,
    };
  }
  if (pgCode === "42883") {
    return {
      status: 503,
      error:
        "Database is missing required functions. Re-apply db/schema.sql (includes get_pass_public).",
      debug,
    };
  }
  if (pgCode === "28P01" || pgCode === "3D000") {
    return {
      status: 503,
      error:
        "Database rejected the connection. Verify DATABASE_URL user, password, and database name.",
      debug,
    };
  }
  if (pgCode === "42501") {
    return {
      status: 503,
      error:
        "Database permission denied. Re-run schema grants or use a role with access to SmartPass tables.",
      debug,
    };
  }

  return {
    status: 500,
    error: options.fallbackError,
    debug,
  };
}
