const MatchService = {
  msgAllPlayers: (connections, msg) => {
    Object.keys(connections).forEach((playerId) => {
      const playerConnections = connections[playerId] || [];
      playerConnections.forEach((playerConnection) => playerConnection.send(JSON.stringify(msg)));
    });
  },
}

module.exports = MatchService;