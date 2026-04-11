import { NextResponse } from "next/server";
import { getPassPublicByToken } from "@/lib/pass-public";
import { apiErrorStatus, isDatabaseConnectivityError } from "@/lib/db/errors";

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
    const message = e instanceof Error ? e.message : "Unknown error";
    const isConfig = message.includes("Missing DATABASE_URL");
    const connectivity = isDatabaseConnectivityError(e);
    const status = apiErrorStatus(e, isConfig);
    const errorText = isConfig
      ? "Database is not configured."
      : connectivity
        ? "Database is temporarily unreachable."
        : "Something went wrong.";
    return NextResponse.json(
      {
        error: errorText,
        ...(process.env.NODE_ENV === "development" ? { debug: message } : {}),
      },
      { status }
    );
  }
}
