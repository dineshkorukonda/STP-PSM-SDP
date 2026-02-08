-- SmartPass schema for Neon (Postgres). Run this in Neon SQL Editor or via migration.
-- Matches ERD: users, passes, transport_types, pass_transport_map, payments, validation_logs.

-- Enable UUID extension if not already
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users (email);

-- Transport types (reference data)
CREATE TABLE IF NOT EXISTS transport_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Passes
CREATE TABLE IF NOT EXISTS passes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  pass_type VARCHAR(50),
  duration_type VARCHAR(50),
  start_date DATE,
  expiry_date DATE,
  status VARCHAR(50),
  qr_token VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS passes_user_id_idx ON passes (user_id);

-- Pass – transport type mapping (many-to-many)
CREATE TABLE IF NOT EXISTS pass_transport_map (
  id SERIAL PRIMARY KEY,
  pass_id UUID NOT NULL REFERENCES passes (id) ON DELETE CASCADE,
  transport_type_id INT NOT NULL REFERENCES transport_types (id) ON DELETE CASCADE,
  UNIQUE (pass_id, transport_type_id)
);

CREATE INDEX IF NOT EXISTS pass_transport_map_pass_id_idx ON pass_transport_map (pass_id);
CREATE INDEX IF NOT EXISTS pass_transport_map_transport_type_id_idx ON pass_transport_map (transport_type_id);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  pass_id UUID NOT NULL REFERENCES passes (id) ON DELETE CASCADE,
  amount DECIMAL(10, 2),
  payment_status VARCHAR(50),
  transaction_reference VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS payments_user_id_idx ON payments (user_id);
CREATE INDEX IF NOT EXISTS payments_pass_id_idx ON payments (pass_id);

-- Validation logs
CREATE TABLE IF NOT EXISTS validation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pass_id UUID NOT NULL REFERENCES passes (id) ON DELETE CASCADE,
  transport_type_id INT NOT NULL REFERENCES transport_types (id) ON DELETE CASCADE,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location VARCHAR(255),
  validation_status VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS validation_logs_pass_id_idx ON validation_logs (pass_id);
CREATE INDEX IF NOT EXISTS validation_logs_transport_type_id_idx ON validation_logs (transport_type_id);

-- Seed default transport types (optional)
INSERT INTO transport_types (name, is_active) VALUES
  ('Bus', true),
  ('Metro', true),
  ('Shared Vehicle', true),
  ('All-in-One', true)
ON CONFLICT (name) DO NOTHING;
