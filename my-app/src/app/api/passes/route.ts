import { NextResponse } from "next/server";
import { getNeonDb } from "@/lib/db/neon";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId required." }, { status: 400 });
    }

    const sql = getNeonDb();
    const rows = await sql`
      SELECT p.id, p.user_id, p.pass_type, p.duration_type, p.expiry_date, p.created_at, u.name AS user_name
      FROM passes p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ${userId}
      ORDER BY p.created_at DESC
    `;

    const passes = rows.map((r: Record<string, unknown>) => ({
      id: String(r.id),
      userId: String(r.user_id),
      userName: String(r.user_name ?? ""),
      transportType: String(r.pass_type ?? ""),
      duration: String(r.duration_type ?? ""),
      expiryDate: r.expiry_date ? String(r.expiry_date).slice(0, 10) : "",
      createdAt: r.created_at ? new Date(String(r.created_at)).toISOString() : "",
    }));

    return NextResponse.json(passes);
  } catch (e) {
    console.error("Get passes error:", e);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, userName, transportType, duration } = body as {
      userId?: string;
      userName?: string;
      transportType?: string;
      duration?: string;
    };

    if (!userId?.trim() || !userName?.trim() || !transportType || !duration) {
      return NextResponse.json(
        { error: "userId, userName, transportType, and duration are required." },
        { status: 400 }
      );
    }

    const sql = getNeonDb();

    const startDate = new Date();
    const expiry = new Date();
    if (duration === "Daily") expiry.setDate(expiry.getDate() + 1);
    else if (duration === "Weekly") expiry.setDate(expiry.getDate() + 7);
    else if (duration === "Monthly") expiry.setMonth(expiry.getMonth() + 1);
    const expiryDate = expiry.toISOString().slice(0, 10);
    const startDateStr = startDate.toISOString().slice(0, 10);
    const qrToken = `SP-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    const inserted = await sql`
      INSERT INTO passes (user_id, pass_type, duration_type, start_date, expiry_date, status, qr_token)
      VALUES (${userId}, ${transportType}, ${duration}, ${startDateStr}, ${expiryDate}, 'active', ${qrToken})
      RETURNING id, user_id, pass_type, duration_type, expiry_date, created_at
    `;
    const row = inserted[0] as { id: string; user_id: string; pass_type: string; duration_type: string; expiry_date: string; created_at: string };

    const transportTypeIdResult = await sql`
      SELECT id FROM transport_types WHERE name = ${transportType} LIMIT 1
    `;
    const transportTypeId = transportTypeIdResult[0] as { id: number } | undefined;
    if (transportTypeId?.id) {
      await sql`
        INSERT INTO pass_transport_map (pass_id, transport_type_id)
        VALUES (${row.id}, ${transportTypeId.id})
      `;
    }

    const pass = {
      id: row.id,
      userId: row.user_id,
      userName,
      transportType: row.pass_type,
      duration: row.duration_type,
      expiryDate: String(row.expiry_date).slice(0, 10),
      createdAt: new Date(row.created_at).toISOString(),
    };

    return NextResponse.json(pass);
  } catch (e) {
    console.error("Create pass error:", e);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
