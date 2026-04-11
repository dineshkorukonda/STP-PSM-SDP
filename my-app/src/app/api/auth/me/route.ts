import { NextResponse } from "next/server";
import { loadSessionUser } from "@/lib/auth/load-session-user";

export async function GET() {
  const result = await loadSessionUser();

  if (result.status === "ok") {
    return NextResponse.json({ user: result.user });
  }

  if (result.status === "unauthenticated") {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json(
    {
      user: null,
      error: result.message,
      ...(result.debug ? { debug: result.debug } : {}),
    },
    { status: result.httpStatus }
  );
}
