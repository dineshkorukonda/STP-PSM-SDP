import { NextResponse } from "next/server";
import { getPassPublicByToken } from "@/lib/pass-public";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    if (!token || token.length < 8) {
      return NextResponse.json({ error: "Invalid token." }, { status: 400 });
    }

    const pass = await getPassPublicByToken(token);
    if (!pass) {
      return NextResponse.json({ pass: null });
    }

    return NextResponse.json({ pass });
  } catch (e) {
    console.error("verify-pass:", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
