import { NextResponse } from "next/server";
import { getNeonDb } from "@/lib/db/neon";
import { hashPassword } from "@/lib/auth";
import { getSessionCookieHeader } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body as { name?: string; email?: string; password?: string };

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const sql = getNeonDb();
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await sql`
      SELECT id FROM users WHERE email = ${normalizedEmail}
    `;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const inserted = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name.trim()}, ${normalizedEmail}, ${passwordHash})
      RETURNING id, name, email
    `;
    const user = inserted[0] as { id: string; name: string | null; email: string };

    const userData = { id: user.id, name: user.name ?? name.trim(), email: user.email };
    const res = NextResponse.json(userData);
    res.headers.set("Set-Cookie", getSessionCookieHeader(userData));
    return res;
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
