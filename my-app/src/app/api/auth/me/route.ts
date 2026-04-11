import { NextResponse } from "next/server";
import { getPool } from "@/lib/db/pool";
import { getSessionUserId } from "@/lib/auth/session";

export async function GET() {
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
}
