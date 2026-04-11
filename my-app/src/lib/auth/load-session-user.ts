import { getPool } from "@/lib/db/pool";
import { describeServerDbFailure } from "@/lib/db/errors";
import { getSessionUserId } from "@/lib/auth/session";
import type { User } from "@/types";

export type LoadSessionUserResult =
  | { status: "ok"; user: User }
  | { status: "unauthenticated" }
  | { status: "error"; httpStatus: number; message: string; debug?: string };

export async function loadSessionUser(): Promise<LoadSessionUserResult> {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return { status: "unauthenticated" };
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
      return { status: "unauthenticated" };
    }

    const name =
      row.display_name?.trim() ||
      row.email.split("@")[0] ||
      "";

    return {
      status: "ok",
      user: { id: row.id, email: row.email, name },
    };
  } catch (e) {
    console.error("loadSessionUser:", e);
    const d = describeServerDbFailure(e, { fallbackError: "Could not load session." });
    return {
      status: "error",
      httpStatus: d.status,
      message: d.error,
      ...(d.debug ? { debug: d.debug } : {}),
    };
  }
}
