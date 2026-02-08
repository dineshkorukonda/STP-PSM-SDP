/**
 * Database types matching the ERD (Neon / Postgres schema).
 * Tables: users, passes, transport_types, pass_transport_map, payments, validation_logs.
 */

export interface DbUser {
  id: string;
  name: string | null;
  email: string;
  password_hash: string;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DbPass {
  id: string;
  user_id: string;
  pass_type: string | null;
  duration_type: string | null;
  start_date: string | null;
  expiry_date: string | null;
  status: string | null;
  qr_token: string | null;
  created_at: string | null;
}

export interface DbTransportType {
  id: number;
  name: string;
  is_active: boolean | null;
  created_at: string | null;
}

export interface DbPassTransportMap {
  id: number;
  pass_id: string;
  transport_type_id: number;
}

export interface DbPayment {
  id: string;
  user_id: string;
  pass_id: string;
  amount: string | null;
  payment_status: string | null;
  transaction_reference: string | null;
  created_at: string | null;
}

export interface DbValidationLog {
  id: string;
  pass_id: string;
  transport_type_id: number;
  scanned_at: string | null;
  location: string | null;
  validation_status: string | null;
}
