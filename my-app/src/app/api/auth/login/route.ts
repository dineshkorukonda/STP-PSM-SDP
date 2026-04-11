import { NextResponse } from "next/server";
import { getPool } from "@/lib/db/pool";
import { verifyPassword } from "@/lib/auth/password";
import { signSessionToken } from "@/lib/auth/jwt";
import { SESSION_COOKIE, SESSION_MAX_AGE_SEC } from "@/lib/auth/constants";
import { apiErrorStatus, isDatabaseConnectivityError } from "@/lib/db/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

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
    const message = e instanceof Error ? e.message : "";
    if (message.includes("Missing DATABASE_URL")) {
      return NextResponse.json(
        { error: "Server is missing DATABASE_URL." },
        { status: 503 }
      );
    }
    if (message.includes("AUTH_SECRET")) {
      return NextResponse.json(
        { error: "Server is missing a valid AUTH_SECRET." },
        { status: 503 }
      );
    }
    const status = apiErrorStatus(e, false);
    const errMsg = isDatabaseConnectivityError(e)
      ? "Database is temporarily unreachable."
      : "Login failed.";
    return NextResponse.json(
      {
        error: errMsg,
        ...(process.env.NODE_ENV === "development" ? { debug: message } : {}),
      },
      { status }
    );
  }
}
