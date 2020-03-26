const MatchModel = require('../models/match');
const MatchService = require('../services/matchServices');

const connections = {};
const matchPlayers = {};

const onConnect = (matchId) => {
  console.log(`new connection to match: ${matchId}`);
};

const onClose = (matchId, connection) => {
  // on disconnect
  console.log('close', connection.id);

  if (connection.id) {
    const playerConnections = connections[connection.id] || [];
    connections[connection.id] = playerConnections.filter(({ id }) => id !== connection.id);
  }
};

const onMessage = async (matchId, connection, data) => {
  const matchData = await MatchModel.getById(matchId);

  if (!matchData) return;

  if (data.action === 'AUTH') {
    const { uid } = data;
    const { player_one, player_two } = matchData;

    if (player_one && player_two) {
      const isMatchPlayer = [player_one, player_two].includes(uid);
      if (!isMatchPlayer) return;
    };

    connection.id = uid;
    const playerConnections = connections[uid] || [];
    connections[uid] = [...playerConnections, connection];  //  { uid: [{connecion1}, {connection2}, {connection3},...] };

    const currentMatchPlayers = (matchPlayers[matchId] || []).filter(id => id !== uid);
    matchPlayers[matchId] = [...currentMatchPlayers, uid];  //   { matchId: [player_one, player_two] };

    if (uid !== player_one && !player_two) {
      const updatedMatch = await MatchModel.updatePlayerTwo(matchId, uid);

      const response = MatchModel.createMatchObject(updatedMatch);
      return MatchService.msgAllPlayers(connections, response);
    };

    const response = MatchModel.createMatchObject(matchData);
    return MatchService.msgAllPlayers(connections, response);
  };

  if (data.action === 'SHIP_PLACEMENTS') {
    const { uid, placements, turn } = data;
    const { player_one, player_two } = matchData;
    const player = (uid === player_one && 'player_one') || (uid === player_two && 'player_two');
    if (!player) return;

    const match = await MatchModel.updateShipPlacements(matchId, player, placements, turn);
    const response = MatchModel.createMatchObject(match);
    return MatchService.msgAllPlayers(connections, response);
  };

  if (data.action === 'ATTACK') {
    const { row, col, uid, turn } = data;
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

    const match = await MatchModel.updateAttempts(matchId, player, attempts, turn);
    const response = MatchModel.createMatchObject(match);
    return MatchService.msgAllPlayers(connections, response);
  };
};

module.exports = (connection, req) => {
  const matchId = req.params.id;

  onConnect(matchId, connection);

  connection.on('close', () => onClose(matchId, connection));

  connection.on('message', (rawMsg) => {
    const parsedMsg = (() => {
      try {
        return JSON.parse(rawMsg);
      } catch {
        return rawMsg;
      };
    })();
    return onMessage(matchId, connection, parsedMsg);
  });
};
