const shortid = require('shortid');
const supabase = require('../db');

const MatchModel = {
  create: async (playerOneId) => {
    console.log('MatchModel.create called with playerOneId:', playerOneId);
    const matchId = shortid.generate();
    console.log('Generated matchId:', matchId);

    const { data, error } = await supabase
      .from('matches')
      .insert([
        { 
          id: matchId, 
          player_one: playerOneId 
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getById: async (matchId) => {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data;
  },

  updatePlayerTwo: async (matchId, playerTwoId) => {
    const { data, error } = await supabase
      .from('matches')
      .update({ player_two: playerTwoId })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateShipPlacements: async (matchId, player, placements, turn) => {
    const updateData = {
      [`${player}_ship_placements`]: placements,
    };

    if (turn !== undefined) {
      updateData.turn = turn;
    }

    const { data, error } = await supabase
      .from('matches')
      .update(updateData)
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateAttempts: async (matchId, player, attempts) => {
    const updateData = {
      [`${player}_attack_placements`]: attempts,
    };

    const { data, error } = await supabase
      .from('matches')
      .update(updateData)
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateTurn: async (matchId, turn) => {
    const { data, error } = await supabase
      .from('matches')
      .update({ turn: turn })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  createMatchObject: (matchData) => {
    const { id, player_one, player_two, player_one_attack_placements, player_two_attack_placements, player_one_ship_placements, player_two_ship_placements, turn } = matchData;
    return matchInfo = {
      match: id,
      player_one: player_one,
      player_two: player_two,
      player_one_ship_placements: (player_one_ship_placements && true),
      player_two_ship_placements: (player_two_ship_placements && true),
      player_one_attack_placements: player_one_attack_placements,
      player_two_attack_placements: player_two_attack_placements,
      turn: turn,
    };
  },
};

module.exports = MatchModel;
