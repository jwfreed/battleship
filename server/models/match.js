const shortid = require('shortid');
const pool = require('../db');

const MatchModel = {
  create: (playerOneId) => {
    const matchId = shortid.generate();

    const query = 'INSERT INTO matches(id, player_one) VALUES($1, $2) RETURNING *';
    const values = [matchId, playerOneId];

    return pool.query(query, values).then(({ rows }) => rows[0]);
  },

  getById: (matchId) => {
    const query = 'SELECT * FROM matches WHERE id=$1';
    const values = [matchId];

    return pool.query(query, values).then(({ rows }) => rows[0]);
  },

  updatePlayerTwo: (matchId, playerTwoId) => {
    const query = 'UPDATE matches SET player_two = $1 WHERE id = $2 RETURNING *';
    const values = [playerTwoId, matchId];

    return pool.query(query, values).then(({ rows }) => rows[0]);
  },

  updateShipPlacements: (matchId, player, placements) => {
    const query = `UPDATE matches SET ${player}_ship_placements = $1 WHERE id = $2 RETURNING *`;
    const values = [placements, matchId];

    return pool.query(query, values).then(({ rows }) => rows[0]);
  },

  updateAttempts: (matchId, player, attempts) => {
    const query = `UPDATE matches SET ${player}_attack_placements = $1 WHERE id = $2 RETURNING *`;
    const values = [JSON.stringify(attempts), matchId];

    return pool.query(query, values).then(({ rows }) => rows[0]);
  },

  createMatchObject: (matchData) => {
    const { id, player_one, player_two, player_one_attack_placements, player_two_attack_placements, status } = matchData;
    return matchInfo = {
      match: id,
      player_one: player_one,
      player_two: player_two,
      player_one_attack_placements: player_one_attack_placements,
      player_two_attack_placements: player_two_attack_placements,
      status: status,
    };
  },
};

module.exports = MatchModel;