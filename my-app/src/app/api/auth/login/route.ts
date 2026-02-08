import { NextResponse } from "next/server";
import { getNeonDb } from "@/lib/db/neon";
import { verifyPassword } from "@/lib/auth";
import { getSessionCookieHeader } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const sql = getNeonDb();
    const normalizedEmail = email.trim().toLowerCase();

    const rows = await sql`
      SELECT id, name, email, password_hash FROM users WHERE email = ${normalizedEmail}
    `;
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const user = rows[0] as { id: string; name: string | null; email: string; password_hash: string };
    if (!verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const userData = { id: user.id, name: user.name ?? "", email: user.email };
    const res = NextResponse.json(userData);
    res.headers.set("Set-Cookie", getSessionCookieHeader(userData));
    return res;
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
