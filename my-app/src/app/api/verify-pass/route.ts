import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";
import type { VerifiedPassDetails } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    if (!token || token.length < 8) {
      return NextResponse.json({ error: "Invalid token." }, { status: 400 });
    }

    const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase.rpc("get_pass_public", {
      p_qr_token: token,
    });

    if (error) {
      console.error("verify-pass rpc:", error);
      return NextResponse.json({ error: "Verification failed." }, { status: 500 });
    }

    if (data == null) {
      return NextResponse.json({ pass: null });
    }

    const row = data as Record<string, unknown>;
    const pass: VerifiedPassDetails = {
      id: String(row.id ?? ""),
      passType: String(row.passType ?? ""),
      duration: String(row.duration ?? ""),
      startDate: row.startDate != null ? String(row.startDate) : "",
      expiryDate: row.expiryDate != null ? String(row.expiryDate) : "",
      status: String(row.status ?? ""),
      holderName: String(row.holderName ?? ""),
      valid: Boolean(row.valid),
    };

    return NextResponse.json({ pass });
  } catch (e) {
    console.error("verify-pass:", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
