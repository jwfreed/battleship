const fetchPlayers = async (matchId, pool) => {
  const playerQuery = 'SELECT player1, player2 FROM matches WHERE id = $1';
  const playerValues = [matchId];
  const result = await pool.query(playerQuery, playerValues);
  const players = result.rows[0];
  return players;
};

module.exports = fetchPlayers;
