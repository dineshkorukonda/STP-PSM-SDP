import { NextResponse } from "next/server";
import { getPool } from "@/lib/db/pool";
import { verifyPassword } from "@/lib/auth/password";
import { signSessionToken } from "@/lib/auth/jwt";
import { SESSION_COOKIE, SESSION_MAX_AGE_SEC } from "@/lib/auth/constants";
import { describeServerDbFailure } from "@/lib/db/errors";

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    const b =
      body && typeof body === "object"
        ? (body as Record<string, unknown>)
        : {};
    const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
    const password = typeof b.password === "string" ? b.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const pool = getPool();
    const { rows } = await pool.query<{
      id: string;
      email: string;
      password_hash: string;
      display_name: string | null;
    }>(
      `select id, email, password_hash, display_name from users where lower(email) = lower($1) limit 1`,
      [email]
    );

    const row = rows[0];
    if (!row || !(await verifyPassword(password, row.password_hash))) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await signSessionToken(row.id);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_MAX_AGE_SEC,
    });
    return res;
  } catch (e) {
    console.error("auth/login:", e);
    const d = describeServerDbFailure(e, { fallbackError: "Login failed." });
    return NextResponse.json(
      { error: d.error, ...(d.debug ? { debug: d.debug } : {}) },
      { status: d.status }
    );
  }
}
