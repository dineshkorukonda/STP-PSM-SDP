import { NextResponse } from "next/server";
import { getPool } from "@/lib/db/pool";
import { getSessionUserId } from "@/lib/auth/session";
import {
  computeExpiryDate,
  formatDateISO,
  generateQrToken,
} from "@/lib/pass-utils";
import type { Duration, TransportType } from "@/types";

const TRANSPORT: TransportType[] = [
  "Bus",
  "Metro",
  "Shared Vehicle",
  "All-in-One",
];
const DURATIONS: Duration[] = ["Daily", "Weekly", "Monthly"];

function isTransportType(v: string): v is TransportType {
  return TRANSPORT.includes(v as TransportType);
}

function isDuration(v: string): v is Duration {
  return DURATIONS.includes(v as Duration);
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `select id, user_id, pass_type, duration_type, start_date, expiry_date, status, qr_token, created_at
       from passes where user_id = $1 order by created_at desc`,
      [userId]
    );
    return NextResponse.json({ passes: rows });
  } catch (e) {
    console.error("passes GET:", e);
    return NextResponse.json({ error: "Failed to load passes." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const transportRaw =
      typeof body?.transportType === "string" ? body.transportType : "";
    const durationRaw =
      typeof body?.duration === "string" ? body.duration : "";

    if (!isTransportType(transportRaw) || !isDuration(durationRaw)) {
      return NextResponse.json({ error: "Invalid pass options." }, { status: 400 });
    }

    const { start, expiry } = computeExpiryDate(durationRaw);
    const startDateStr = formatDateISO(start);
    const expiryDateStr = formatDateISO(expiry);
    const qrToken = generateQrToken();

    const pool = getPool();
    const client = await pool.connect();
    try {
      await client.query("begin");
      const { rows: passRows } = await client.query<{
        id: string;
        user_id: string;
        pass_type: string | null;
        duration_type: string | null;
        start_date: string | null;
        expiry_date: string | null;
        status: string | null;
        qr_token: string;
        created_at: string;
      }>(
        `insert into passes (user_id, pass_type, duration_type, start_date, expiry_date, status, qr_token)
         values ($1, $2, $3, $4::date, $5::date, 'active', $6)
         returning id, user_id, pass_type, duration_type, start_date, expiry_date, status, qr_token, created_at`,
        [
          userId,
          transportRaw,
          durationRaw,
          startDateStr,
          expiryDateStr,
          qrToken,
        ]
      );
      const inserted = passRows[0];

      const { rows: ttRows } = await client.query<{ id: number }>(
        `select id from transport_types where name = $1 limit 1`,
        [transportRaw]
      );
      if (ttRows[0]?.id != null) {
        await client.query(
          `insert into pass_transport_map (pass_id, transport_type_id) values ($1, $2)`,
          [inserted.id, ttRows[0].id]
        );
      }
      await client.query("commit");
      return NextResponse.json({ pass: inserted });
    } catch (e) {
      await client.query("rollback");
      throw e;
    } finally {
      client.release();
    }
  } catch (e) {
    console.error("passes POST:", e);
    return NextResponse.json({ error: "Failed to create pass." }, { status: 500 });
  }
}
