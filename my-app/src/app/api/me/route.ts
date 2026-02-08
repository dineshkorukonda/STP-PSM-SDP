import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";

export async function GET(request: Request) {
  const user = getSessionFromRequest(request.headers.get("cookie"));
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json(user);
}
