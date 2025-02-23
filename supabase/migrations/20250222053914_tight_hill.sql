/*
  # Create power metrics table

  1. New Tables
    - `power_metrics`
      - `id` (uuid, primary key)
      - `timestamp` (timestamptz)
      - `consumption` (numeric)
      - `production` (numeric)
      - `renewable` (numeric)
      - `conventional` (numeric)
      - `efficiency` (numeric)
      - `load` (numeric)
      - `weather` (jsonb)
      - `predictions` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `power_metrics` table
    - Add policy for authenticated users to read all data
    - Add policy for service role to insert data
*/

CREATE TABLE IF NOT EXISTS power_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL,
  consumption numeric NOT NULL,
  production numeric NOT NULL,
  renewable numeric NOT NULL,
  conventional numeric NOT NULL,
  efficiency numeric NOT NULL,
  load numeric NOT NULL,
  weather jsonb NOT NULL,
  predictions jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE power_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all authenticated users"
  ON power_metrics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service role to insert data"
  ON power_metrics
  FOR INSERT
  TO service_role
  WITH CHECK (true);