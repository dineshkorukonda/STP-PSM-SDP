import { NextResponse } from "next/server";
import { getPool } from "@/lib/db/pool";
import { getSessionUserId } from "@/lib/auth/session";
import { apiErrorStatus, isDatabaseConnectivityError } from "@/lib/db/errors";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const pool = getPool();
    const { rows } = await pool.query<{
      id: string;
      email: string;
      display_name: string | null;
    }>(
      `select id, email, display_name from users where id = $1 limit 1`,
      [userId]
    );

    const row = rows[0];
    if (!row) {
      return NextResponse.json({ user: null });
    }

    const name =
      row.display_name?.trim() ||
      row.email.split("@")[0] ||
      "";

    return NextResponse.json({
      user: { id: row.id, email: row.email, name },
    });
  } catch (e) {
    console.error("auth/me:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    const isDbConfig = message.includes("Missing DATABASE_URL");
    const isAuthConfig = message.includes("AUTH_SECRET");
    const isConfig = isDbConfig || isAuthConfig;
    const connectivity = isDatabaseConnectivityError(e);
    const status = apiErrorStatus(e, isConfig);
    const errorText = isDbConfig
      ? "Database is not configured."
      : isAuthConfig
        ? "AUTH_SECRET is not configured."
        : connectivity
          ? "Database is temporarily unreachable."
          : "Could not load session.";
    return NextResponse.json(
      {
        user: null,
        error: errorText,
        ...(process.env.NODE_ENV === "development" ? { debug: message } : {}),
      },
      { status }
    );
  }
}
