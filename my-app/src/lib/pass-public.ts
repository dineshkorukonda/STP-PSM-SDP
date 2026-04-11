import { getPool } from "@/lib/db/pool";
import type { VerifiedPassDetails } from "@/types";

export async function getPassPublicByToken(
  rawToken: string
): Promise<VerifiedPassDetails | null> {
  const token = rawToken.trim();
  if (!token || token.length < 8) return null;

  const pool = getPool();
  const { rows } = await pool.query<{ result: Record<string, unknown> | null }>(
    `select get_pass_public($1::text) as result`,
    [token]
  );

  const data = rows[0]?.result;
  if (data == null) return null;

  const row = data as Record<string, unknown>;
  return {
    id: String(row.id ?? ""),
    passType: String(row.passType ?? ""),
    duration: String(row.duration ?? ""),
    startDate: row.startDate != null ? String(row.startDate) : "",
    expiryDate: row.expiryDate != null ? String(row.expiryDate) : "",
    status: String(row.status ?? ""),
    holderName: String(row.holderName ?? ""),
    valid: Boolean(row.valid),
  };
}
