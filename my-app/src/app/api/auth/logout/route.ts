import { NextResponse } from "next/server";
import { getClearSessionCookieHeader } from "@/lib/session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", getClearSessionCookieHeader());
  return res;
}
