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

export function apiErrorStatus(err: unknown, isConfig: boolean): number {
  if (isConfig || isDatabaseConnectivityError(err)) return 503;
  return 500;
}
