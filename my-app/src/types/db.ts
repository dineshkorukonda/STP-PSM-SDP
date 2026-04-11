/**
 * Postgres schema (see db/schema.sql).
 */

export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
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
