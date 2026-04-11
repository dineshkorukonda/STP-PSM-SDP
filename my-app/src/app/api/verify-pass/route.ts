import { NextResponse } from "next/server";
import { getPassPublicByToken } from "@/lib/pass-public";
import { describeServerDbFailure } from "@/lib/db/errors";

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
    const d = describeServerDbFailure(e, { fallbackError: "Something went wrong." });
    return NextResponse.json(
      { error: d.error, ...(d.debug ? { debug: d.debug } : {}) },
      { status: d.status }
    );
  }
}
