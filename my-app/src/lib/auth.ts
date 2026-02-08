import { createHash, timingSafeEqual } from "crypto";

const SALT = "smartpass-v1";

export function hashPassword(password: string): string {
  return createHash("sha256").update(SALT + password).digest("hex");
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  const h = hashPassword(password);
  if (h.length !== passwordHash.length) return false;
  try {
    return timingSafeEqual(Buffer.from(h, "hex"), Buffer.from(passwordHash, "hex"));
  } catch {
    return false;
  }
}
