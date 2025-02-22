/*
  # Remove authentication requirements

  1. Changes
    - Update RLS policies to allow public access to power_metrics table
    - Remove authentication requirement for read access
    - Allow public read access to all power metrics data
    
  2. Security
    - Removes authentication requirement
    - Enables public read access
    - Maintains service role insert capability
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow read access to all authenticated users" ON power_metrics;

-- Create new public access policy
CREATE POLICY "Allow public read access"
  ON power_metrics
  FOR SELECT
  USING (true);

-- Keep the service role insert policy
DROP POLICY IF EXISTS "Allow service role to insert data" ON power_metrics;
CREATE POLICY "Allow service role to insert data"
  ON power_metrics
  FOR INSERT
  TO service_role
  WITH CHECK (true);