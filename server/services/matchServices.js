const MatchService = {
  msgAllPlayers: (connections, msg) => {
    console.log('msgAllPlayers sending:', JSON.stringify(msg, null, 2));
    Object.keys(connections).forEach((playerId) => {
      const playerConnections = connections[playerId] || [];
      playerConnections.forEach((playerConnection) => {
        // Only send if the connection is open (readyState === 1)
        if (playerConnection.readyState === 1) {
          try {
            playerConnection.send(JSON.stringify(msg));
            console.log(`Sent message to player ${playerId}`);
          } catch (error) {
            console.error(`Failed to send message to player ${playerId}:`, error.message);
          }
        }
      });
    });
  },
}

module.exports = MatchService;