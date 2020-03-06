const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const pool = require('./db');
const fetchPlayers = require('./actions');

const port = 3000;
const app = express();
const ews = expressWs(app);

app.use(cors());
app.use(bodyParser.json());

app.post('/match', async (req, res) => {
  const matchId = shortid.generate();
  const userId = req.body.uid;

  const query = 'INSERT INTO matches(id, player1) VALUES($1, $2) RETURNING *';
  const values = [matchId, userId];

  try {
    const result = await pool.query(query, values);
    const match = result.rows[0];

    return res.json({ success: true, data: match });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});

const connections = {};

app.ws('/match/:id', (connection, req) => {
  const matchId = req.params.id;

  connection.send(`(${matchId}): connected`);
  // on connect

  connection.on('close', () => {
    // on disconnect
    console.log('close', connection.id);

    if (connection.id) {
      const playerConnections = connections[connection.id] || [];
      connections[connection.id] = playerConnections.filter(({ id }) => id !== connection.id);
    }
  });

  connection.on('message', async (msg) => {
    // on message
    const data = JSON.parse(msg);

    if (data.action === 'auth') {

      connection.id = data.id; // player id generated from client
      const playerConnections = connections[data.id] || [];
      connections[data.id] = [...playerConnections, connection];

      console.log(`from: ${connection.id}`, msg);

      const query = 'UPDATE matches SET player2 = $1 WHERE id = $2';
      const values = [data.id, matchId]; // player2 value from client
      await pool.query(query, values);

      Object.keys(connections).forEach((playerId) => {
        if (playerId === data.id) return;

        const playerConnections = connections[playerId] || [];
        playerConnections.forEach((playerConnection) => playerConnection.send('opponent connected'));
      });
    };

    if (data.action === 'shipPlacement') {
      const placements = data.placements;

      console.log(placements)
      const players = await fetchPlayers(matchId, pool);

      if (players.player1 !== connection.id && players.player2 !== connection.id) {
        connection.send('you are not a player in this game');
        return;
      } else if (players.player1 === connection.id) {
        const query = 'UPDATE matches SET playeroneshipplacements = $1 WHERE id = $2';
        const values = [placements, matchId];
        await pool.query(query, values);
      } else {
        const query = 'UPDATE matches SET playertwoshipplacements = $1 WHERE id = $2';
        const values = [JSON.stringify(placements), matchId];
        await pool.query(query, values);
      };

      Object.keys(connections).forEach((playerId) => {
        if (playerId === connection.id) return;

        const playerConnections = connections[playerId] || [];
        playerConnections.forEach((playerConnection) => playerConnection.send('opponent placed his ships'));
      });
    };

    if (data.action === 'attackPlacement') {
      const attack = data.attackPlacement;

      const matchQuery = 'SELECT player1, player2, playeroneshipplacements, playertwoshipplacements, playeroneattackplacements, playertwoattackplacements FROM matches WHERE id = $1';
      const matchValues = [matchId];
      const result = await pool.query(matchQuery, matchValues);
      const matchData = result.rows[0];

      const row = attack[0];
      const col = attack[1];

      if (matchData.player1 !== connection.id && matchData.player2 !== connection.id) {
        connection.send('you are not a player in this game');
        return;
      }
      if (matchData.player1 === connection.id) {
        if (matchData.playeroneattackplacements) {
          const attackPlacements = matchData.playeroneattackplacements;
          attackPlacements.push([row, col]);

          const query = 'UPDATE matches SET playeroneattackplacements = ARRAY[$1] WHERE id = $2';
          const values = [JSON.stringify(attackPlacements), matchId];
          await pool.query(query, values);
          return;
        }
        const query = 'UPDATE matches SET playeroneattackplacements = ARRAY[$1] WHERE id = $2';
        const values = [JSON.stringify([row, col]), matchId];
        await pool.query(query, values);

        if (matchData.playertwoshipplacements[row] && matchData.playertwoshipplacements[row][col]) {
          Object.keys(connections).forEach((playerId) => {
            const playerConnections = connections[playerId];
            playerConnections.forEach((connection) => connection.send('hit!'));
          });
        } else {
          Object.keys(connections).forEach((playerId) => {
            const playerConnections = connections[playerId];
            playerConnections.forEach((connection) => connection.send('miss!'));
          });
        };
      };
      if (matchData.playertwoattackplacements) {
        const attackPlacements = matchData.playertwoattackplacements;
        attackPlacements.push([row, col]);
        console.log('attack', attackPlacements)
        const query = 'UPDATE matches SET playertwoattackplacements = $1 WHERE id = $2';
        const values = [JSON.stringify(attackPlacements), matchId];
        await pool.query(query, values);
        return;
      };
      const query = 'UPDATE matches SET playertwoattackplacements = $1 WHERE id = $2';
      const values = [JSON.stringify([row, col]), matchId];
      await pool.query(query, values);

      if (matchData.playeroneshipplacements[row] && matchData.playeroneshipplacements[row][col]) {
        Object.keys(connections).forEach((playerId) => {
          const playerConnections = connections[playerId];
          playerConnections.forEach((connection) => connection.send('hit!'));
        });
      } else {
        Object.keys(connections).forEach((playerId) => {
          const playerConnections = connections[playerId];
          playerConnections.forEach((connection) => connection.send('miss!'));
        });
      };
    };
  });
});

app.listen(port, () => console.log(`Battleship server listening on port ${port}!`));
