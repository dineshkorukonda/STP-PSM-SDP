import { NextResponse } from "next/server";
import { getPool } from "@/lib/db/pool";
import { hashPassword } from "@/lib/auth/password";
import { signSessionToken } from "@/lib/auth/jwt";
import { SESSION_COOKIE, SESSION_MAX_AGE_SEC } from "@/lib/auth/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const name =
      typeof body?.name === "string" ? body.name.trim() : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Use at least 6 characters for the password." },
        { status: 400 }
      );
    }

    const pool = getPool();
    const passwordHash = await hashPassword(password);

    let userId: string;
    try {
      const { rows } = await pool.query<{ id: string }>(
        `insert into users (email, password_hash, display_name)
         values ($1, $2, $3)
         returning id`,
        [email, passwordHash, name || null]
      );
      userId = rows[0].id;
    } catch (e: unknown) {
      const code = e && typeof e === "object" && "code" in e ? String((e as { code: string }).code) : "";
      if (code === "23505") {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }
      throw e;
    }

    const token = await signSessionToken(userId);
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
    console.error("auth/signup:", e);
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}
