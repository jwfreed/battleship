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

  updateShipPlacements: (matchId, player, placements, turn, gameStarted) => {
    const query = `UPDATE matches SET ${player}_ship_placements = $1, turn =$2, game_started = $3 WHERE id = $4 RETURNING *`;
    const values = [placements, turn, gameStarted, matchId];

    return pool.query(query, values).then(({ rows }) => rows[0]);
  },

  updateAttempts: (matchId, player, attempts) => {
    const query = `UPDATE matches SET ${player}_attack_placements = $1 WHERE id = $2 RETURNING *`;
    const values = [JSON.stringify(attempts), matchId];

    return pool.query(query, values).then(({ rows }) => rows[0]);
  },

  updateTurn: (matchId, turn) => {
    const query = 'UPDATE matches SET turn = $1 WHERE id = $2 RETURNING *';
    const values = [turn, matchId];

    return pool.query(query, values).then(({ rows }) => rows[0]);
  },

  createMatchObject: (matchData) => {
    const { id, player_one, player_two, player_one_attack_placements, player_two_attack_placements, player_one_ship_placements, player_two_ship_placements, turn, game_started } = matchData;
    return matchInfo = {
      match: id,
      player_one: player_one,
      player_two: player_two,
      player_one_ship_placements: (player_one_ship_placements && true),
      player_two_ship_placements: (player_two_ship_placements && true),
      player_one_attack_placements: player_one_attack_placements,
      player_two_attack_placements: player_two_attack_placements,
      turn: turn,
      game_started: game_started,
    };
  },
};

module.exports = MatchModel;