const shortid = require('shortid');
const supabase = require('../db');
const MatchCache = require('../services/matchCache');

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
    MatchCache.set(matchId, data);
    return data;
  },

  getById: async (matchId) => {
    return MatchCache.getOrFetch(matchId, async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      return data;
    });
  },

  // Find active match for a player (not ended)
  findActiveMatchByPlayer: async (playerId) => {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .or(`player_one.eq.${playerId},player_two.eq.${playerId}`)
      .is('winner', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  },

  updatePlayerTwo: async (matchId, playerTwoId) => {
    const { data, error } = await supabase
      .from('matches')
      .update({ player_two: playerTwoId })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    MatchCache.set(matchId, data);
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
    MatchCache.set(matchId, data);
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
    MatchCache.set(matchId, data);
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
    MatchCache.set(matchId, data);
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

  // Create a player-specific match object that includes their own ship placements for rejoin
  createPlayerMatchObject: (matchData, playerId) => {
    const { id, player_one, player_two, player_one_attack_placements, player_two_attack_placements, player_one_ship_placements, player_two_ship_placements, turn } = matchData;
    
    const isPlayerOne = playerId === player_one;
    const myShipPlacements = isPlayerOne ? player_one_ship_placements : player_two_ship_placements;
    
    return {
      match: id,
      player_one: player_one,
      player_two: player_two,
      player_one_ship_placements: (player_one_ship_placements && true),
      player_two_ship_placements: (player_two_ship_placements && true),
      player_one_attack_placements: player_one_attack_placements,
      player_two_attack_placements: player_two_attack_placements,
      turn: turn,
      // Include the player's own ship placements for state restoration
      my_ship_placements: myShipPlacements || null,
    };
  },
};

module.exports = MatchModel;
