import { createHmac, timingSafeEqual } from "crypto";
import type { User } from "@/types";

const COOKIE_NAME = "smartpass_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const SECRET =
  process.env.SESSION_SECRET ??
  (process.env.NODE_ENV === "production" ? undefined : "dev-secret-change-in-production");

function getSecret(): string {
  if (SECRET == null || SECRET === "") throw new Error("SESSION_SECRET must be set in production");
  return SECRET;
}

function encodeBase64Url(buf: Buffer): string {
  return buf.toString("base64url");
}
function decodeBase64Url(s: string): Buffer {
  return Buffer.from(s, "base64url");
}

export function createSessionToken(user: User): string {
  const payload = JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE,
  });
  const payloadB64 = encodeBase64Url(Buffer.from(payload, "utf8"));
  const sig = createHmac("sha256", getSecret()).update(payloadB64).digest();
  return `${payloadB64}.${encodeBase64Url(sig)}`;
}

export function verifySessionToken(token: string): User | null {
  try {
    const [payloadB64, sigB64] = token.split(".");
    if (!payloadB64 || !sigB64) return null;
    const sig = createHmac("sha256", getSecret()).update(payloadB64).digest();
    const sigFromCookie = decodeBase64Url(sigB64);
    if (sig.length !== sigFromCookie.length || !timingSafeEqual(sig, sigFromCookie))
      return null;
    const payload = JSON.parse(
      decodeBase64Url(payloadB64).toString("utf8")
    ) as { id: string; name: string; email: string; exp: number };
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { id: payload.id, name: payload.name, email: payload.email };
  } catch {
    return null;
  }
}

export function getSessionCookieHeader(user: User): string {
  const value = createSessionToken(user);
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export function getSessionFromRequest(cookieHeader: string | null): User | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const token = match?.[1]?.trim();
  return token ? verifySessionToken(token) : null;
}

export function getClearSessionCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
