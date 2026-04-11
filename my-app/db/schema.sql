-- SmartPass local Postgres (no Supabase). Apply with: psql "$DATABASE_URL" -f db/schema.sql

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transport_types (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO transport_types (name, is_active) VALUES
  ('Bus', true),
  ('Metro', true),
  ('Shared Vehicle', true),
  ('All-in-One', true)
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  pass_type text,
  duration_type text,
  start_date date,
  expiry_date date,
  status text DEFAULT 'active',
  qr_token text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS passes_user_id_idx ON passes (user_id);
CREATE INDEX IF NOT EXISTS passes_qr_token_idx ON passes (qr_token);

CREATE TABLE IF NOT EXISTS pass_transport_map (
  id serial PRIMARY KEY,
  pass_id uuid NOT NULL REFERENCES passes (id) ON DELETE CASCADE,
  transport_type_id int NOT NULL REFERENCES transport_types (id) ON DELETE CASCADE,
  UNIQUE (pass_id, transport_type_id)
);

CREATE INDEX IF NOT EXISTS pass_transport_map_pass_id_idx ON pass_transport_map (pass_id);

CREATE OR REPLACE FUNCTION get_pass_public(p_qr_token text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
BEGIN
  IF p_qr_token IS NULL OR length(trim(p_qr_token)) < 8 THEN
    RETURN NULL;
  END IF;

  SELECT jsonb_build_object(
    'id', p.id,
    'passType', p.pass_type,
    'duration', p.duration_type,
    'startDate', p.start_date,
    'expiryDate', p.expiry_date,
    'status', p.status,
    'holderName', u.display_name,
    'valid', (p.status = 'active' AND p.expiry_date >= CURRENT_DATE)
  )
  INTO result
  FROM passes p
  JOIN users u ON u.id = p.user_id
  WHERE p.qr_token = trim(p_qr_token)
  LIMIT 1;

  RETURN result;
END;
$$;

-- ---------------------------------------------------------------------------
-- Permissions
-- If the app connects as a different PostgreSQL user than the one that ran
-- this script, inserts fail with "permission denied for table …". These
-- grants let any database role use the SmartPass objects (fine for local dev;
-- in production use one app role and grant only what it needs).
-- ---------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO PUBLIC;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO PUBLIC;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO PUBLIC;
