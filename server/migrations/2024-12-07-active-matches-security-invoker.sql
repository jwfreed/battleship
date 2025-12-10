-- Fix view security: ensure active_matches runs with caller permissions (security_invoker)
CREATE OR REPLACE VIEW public.active_matches
WITH (security_invoker = true) AS
SELECT 
  id,
  player_one,
  player_two,
  turn,
  created_at,
  updated_at,
  (player_one_ship_placements IS NOT NULL) AS player_one_ready,
  (player_two_ship_placements IS NOT NULL) AS player_two_ready
FROM public.matches
WHERE player_two IS NOT NULL;
