/*
  # Create alert subscribers table

  1. New Tables
    - `alert_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `preferences` (jsonb, for future customization)

  2. Security
    - Enable RLS on `alert_subscribers` table
    - Add policies for authenticated users to manage their subscriptions
*/

CREATE TABLE IF NOT EXISTS alert_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  preferences jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE alert_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to check if email exists
CREATE POLICY "Allow public email existence check"
  ON alert_subscribers
  FOR SELECT
  USING (true);

-- Allow authenticated users to manage their own subscriptions
CREATE POLICY "Users can manage their subscriptions"
  ON alert_subscribers
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = email)
  WITH CHECK (auth.jwt() ->> 'email' = email);