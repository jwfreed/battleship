const MatchModel = require('../models/match');
const MatchService = require('../services/matchServices');
const { checkWsRateLimit } = require('../middleware/rateLimiter');

// Use Map for O(1) lookups instead of plain objects
const connections = new Map();
const matchPlayers = new Map();

const onConnect = (matchId, connection) => {
  console.log(`new connection to match: ${matchId}`);
  
  // Set up heartbeat
  connection.isAlive = true;
  connection.on('pong', () => { connection.isAlive = true; });
};

const onClose = (matchId, connection) => {
  // on disconnect
  console.log('close', connection.id);

  if (connection.id) {
    const playerConnections = connections.get(connection.id) || [];
    // Filter out the closed connection by comparing the actual connection object
    const filteredConnections = playerConnections.filter((conn) => conn !== connection);
    
    if (filteredConnections.length === 0) {
      connections.delete(connection.id);
    } else {
      connections.set(connection.id, filteredConnections);
    }

    // Clean up match players if no connections remain
    const players = matchPlayers.get(matchId);
    if (players) {
      const allConnectionsClosed = !players.some(
        (playerId) => connections.has(playerId) && connections.get(playerId).length > 0
      );
      if (allConnectionsClosed) {
        matchPlayers.delete(matchId);
      }
    }
  }
};

// Helper to get connections object for MatchService compatibility
const getConnectionsObject = () => {
  const obj = {};
  for (const [key, value] of connections.entries()) {
    obj[key] = value;
  }
  return obj;
};

const onMessage = async (matchId, connection, data) => {
  console.log('onMessage received:', { matchId, action: data.action, uid: data.uid });
  
  const matchData = await MatchModel.getById(matchId);

  if (!matchData) {
    console.log('No match data found for', matchId);
    return;
  }

  if (data.action === 'AUTH') {
    const { uid } = data;
    const { player_one, player_two } = matchData;

    if (player_one && player_two) {
      const isMatchPlayer = [player_one, player_two].includes(uid);
      if (!isMatchPlayer) return;
    };

    connection.id = uid;
    const playerConnections = connections.get(uid) || [];
    connections.set(uid, [...playerConnections, connection]);  //  Map: uid => [{connection1}, {connection2}, ...]

    const currentMatchPlayers = (matchPlayers.get(matchId) || []).filter(id => id !== uid);
    matchPlayers.set(matchId, [...currentMatchPlayers, uid]);  //   Map: matchId => [player_one, player_two]

    if (uid !== player_one && !player_two) {
      const updatedMatch = await MatchModel.updatePlayerTwo(matchId, uid);

      const response = MatchModel.createMatchObject(updatedMatch);
      return MatchService.msgAllPlayers(getConnectionsObject(), response);
    };

    const response = MatchModel.createMatchObject(matchData);
    return MatchService.msgAllPlayers(getConnectionsObject(), response);
  };

  if (data.action === 'SHIP_PLACEMENTS') {
    const { uid, placements } = data;
    const { player_one, player_two } = matchData;
    const player = (uid === player_one && 'player_one') || (uid === player_two && 'player_two');
    if (!player) return;

    let match = await MatchModel.updateShipPlacements(matchId, player, placements);

    if (match.player_one_ship_placements && match.player_two_ship_placements && !match.turn) {
      match = await MatchModel.updateTurn(matchId, 'player_one');
    }

    const response = MatchModel.createMatchObject(match);
    return MatchService.msgAllPlayers(getConnectionsObject(), response);
  };

  if (data.action === 'ATTACK') {
    const { row, col, uid } = data;
    const { player_one, player_two } = matchData;
    const player = (uid === player_one && 'player_one') || (uid === player_two && 'player_two');
    if (!player) return;
    const opponent = player === 'player_one' ? 'player_two' : 'player_one';
    const opponentPlacements = matchData[`${opponent}_ship_placements`];
    const hit = opponentPlacements[row] && opponentPlacements[row][col];
    const attempt = { row, col, hit };
    const playerAttempts = matchData[`${player}_attack_placements`];
    const attempts = [];
    playerAttempts ? attempts.push(...playerAttempts, attempt) : attempts.push(attempt);

    console.log(`Attack by ${player} at [${row}, ${col}], switching turn to ${opponent}`);
    
    let match = await MatchModel.updateAttempts(matchId, player, attempts);
    
    // Switch turn to opponent after attack
    match = await MatchModel.updateTurn(matchId, opponent);
    
    console.log('Updated match turn:', match.turn);
    
    const response = MatchModel.createMatchObject(match);
    console.log('Sending response:', response);
    return MatchService.msgAllPlayers(getConnectionsObject(), response);
  };
};

module.exports = (connection, req) => {
  const matchId = req.params.id;

  onConnect(matchId, connection);

  connection.on('close', () => onClose(matchId, connection));

  connection.on('message', async (rawMsg) => {
    try {
      const parsedMsg = (() => {
        try {
          return JSON.parse(rawMsg);
        } catch {
          return rawMsg;
        };
      })();
      
      // Rate limit WebSocket messages
      if (connection.id && !checkWsRateLimit(connection.id)) {
        console.warn(`Rate limit exceeded for user ${connection.id}`);
        if (connection.readyState === 1) {
          connection.send(JSON.stringify({ error: 'Rate limit exceeded' }));
        }
        return;
      }
      
      await onMessage(matchId, connection, parsedMsg);
    } catch (error) {
      console.error(`Error handling message in match ${matchId}:`, error.message);
      // Optionally send error back to client
      if (connection.readyState === 1) {
        try {
          connection.send(JSON.stringify({ error: 'Failed to process message' }));
        } catch (sendError) {
          console.error('Failed to send error message to client:', sendError.message);
        }
      }
    }
  });
};
