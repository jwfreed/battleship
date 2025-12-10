-- Battleship Game Database Schema for Supabase
-- Run this script in your Supabase SQL Editor

-- Drop table if exists (uncomment if you want to reset)
-- DROP TABLE IF EXISTS matches CASCADE;

-- Create the matches table
CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  player_one TEXT NOT NULL,
  player_two TEXT,
  player_one_ship_placements JSONB,
  player_two_ship_placements JSONB,
  player_one_attack_placements JSONB,
  player_two_attack_placements JSONB,
  turn TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_matches_player_one ON matches(player_one);
CREATE INDEX IF NOT EXISTS idx_matches_player_two ON matches(player_two);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SET search_path = public AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (optional - only if using Supabase Auth)
-- These policies allow authenticated users to interact with their own matches

-- Policy: Users can read their own matches
DROP POLICY IF EXISTS "Users can read their own matches" ON matches;
CREATE POLICY "Users can read their own matches"
  ON matches
  FOR SELECT
  USING (
    auth.uid()::text = player_one OR 
    auth.uid()::text = player_two
  );

-- Policy: Users can create matches
DROP POLICY IF EXISTS "Users can create matches" ON matches;
CREATE POLICY "Users can create matches"
  ON matches
  FOR INSERT
  WITH CHECK (auth.uid()::text = player_one);

-- Policy: Users can update their matches
DROP POLICY IF EXISTS "Users can update their matches" ON matches;
CREATE POLICY "Users can update their matches"
  ON matches
  FOR UPDATE
  USING (
    auth.uid()::text = player_one OR 
    auth.uid()::text = player_two
  );

-- Policy: Service role can do everything (bypass RLS for your backend server)
-- This is automatically handled when using service_role key

-- Optional: Create a view for active matches (matches with both players)
-- Use security_invoker so the caller's RLS/permissions are applied
CREATE OR REPLACE VIEW active_matches
WITH (security_invoker = true) AS
SELECT 
  id,
  player_one,
  player_two,
  turn,
  created_at,
  updated_at,
  (player_one_ship_placements IS NOT NULL) as player_one_ready,
  (player_two_ship_placements IS NOT NULL) as player_two_ready
FROM matches
WHERE player_two IS NOT NULL;

-- Optional: Create a function to clean up old matches (older than 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_matches()
RETURNS void
SET search_path = public AS $$
BEGIN
  DELETE FROM matches 
  WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- You can manually run: SELECT cleanup_old_matches();
-- Or set up a cron job in Supabase (requires pg_cron extension on paid plans)

-- Verify the setup
DO $$ 
BEGIN
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE 'Table: matches';
  RAISE NOTICE 'Indexes: created';
  RAISE NOTICE 'Triggers: created';
  RAISE NOTICE 'RLS: enabled';
  RAISE NOTICE 'Policies: created';
END $$;
