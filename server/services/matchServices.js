const MatchService = {
  msgAllPlayers: (connections, msg) => {
    Object.keys(connections).forEach((playerId) => {
      const playerConnections = connections[playerId] || [];
      playerConnections.forEach((playerConnection) => {
        // Only send if the connection is open (readyState === 1)
        if (playerConnection.readyState === 1) {
          try {
            playerConnection.send(JSON.stringify(msg));
          } catch (error) {
            console.error(`Failed to send message to player ${playerId}:`, error.message);
          }
        }
      });
    });
  },
}

module.exports = MatchService;