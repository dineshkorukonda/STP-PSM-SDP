/**
 * Supabase public schema (see supabase/migrations/001_smartpass_supabase.sql).
 */

export interface DbProfile {
  id: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbPass {
  id: string;
  user_id: string;
  pass_type: string | null;
  duration_type: string | null;
  start_date: string | null;
  expiry_date: string | null;
  status: string | null;
  qr_token: string;
  created_at: string;
}

export interface DbTransportType {
  id: number;
  name: string;
  is_active: boolean | null;
  created_at: string;
}

export interface DbPassTransportMap {
  id: number;
  pass_id: string;
  transport_type_id: number;
}
