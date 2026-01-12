-- Run this in Supabase SQL Editor
-- Go to SQL Editor > New Query > paste this and click Run

CREATE TABLE clients (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  service_type VARCHAR(100) NOT NULL,
  notes TEXT,
  welcome_email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clients_email ON clients(email);
