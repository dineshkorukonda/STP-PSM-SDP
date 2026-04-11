import { SignJWT, jwtVerify } from "jose";
import { SESSION_MAX_AGE_SEC } from "./constants";

function getSecret(): Uint8Array {
  const raw = process.env.AUTH_SECRET;
  if (!raw || raw.length < 32) {
    throw new Error("AUTH_SECRET must be set to a string at least 32 characters long");
  }
  return new TextEncoder().encode(raw);
}

export async function signSessionToken(userId: string): Promise<string> {
  const secret = getSecret();
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SEC}s`)
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    const sub = payload.sub;
    return typeof sub === "string" ? sub : null;
  } catch {
    return null;
  }
}
