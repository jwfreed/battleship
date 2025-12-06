require('dotenv').config();
const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const createMatchHandler = require('./handlers/createMatch');
const matchSocketHandler = require('./handlers/matchSocket');
const MatchModel = require('./models/match');
const { createMatchLimiter } = require('./middleware/rateLimiter');

const port = process.env.PORT || 3001;
const app = express();

// Security & performance middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(bodyParser.json({ limit: '10kb' })); // Limit payload size

// Health check endpoint
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Find active match for a player (for rejoin)
app.get('/match/active/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const match = await MatchModel.findActiveMatchByPlayer(uid);
    
    if (!match) {
      return res.json({ success: true, data: null });
    }
    
    // Return player-specific match data including their ship placements
    const matchData = MatchModel.createPlayerMatchObject(match, uid);
    return res.json({ success: true, data: matchData });
  } catch (e) {
    console.error('Error finding active match:', e);
    return res.status(400).json({ success: false, message: e.message });
  }
});

// Get match info for cross-device rejoin (returns player positions, not full data)
app.get('/match/:id/info', async (req, res) => {
  try {
    const { id } = req.params;
    const match = await MatchModel.getById(id);
    
    if (!match) {
      return res.json({ success: false, message: 'Match not found' });
    }
    
    // Return minimal info to show which player slots are taken
    return res.json({ 
      success: true, 
      data: {
        id: match.id,
        hasPlayerOne: !!match.player_one,
        hasPlayerTwo: !!match.player_two,
        // Return partial UIDs for verification (last 4 chars)
        playerOneHint: match.player_one ? match.player_one.slice(-4) : null,
        playerTwoHint: match.player_two ? match.player_two.slice(-4) : null,
      }
    });
  } catch (e) {
    console.error('Error getting match info:', e);
    return res.status(400).json({ success: false, message: e.message });
  }
});

// Cross-device rejoin - verify UID and return full player data
app.post('/match/:id/rejoin', async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.body;
    
    const match = await MatchModel.getById(id);
    
    if (!match) {
      return res.json({ success: false, message: 'Match not found' });
    }
    
    // Verify the UID belongs to this match
    if (match.player_one !== uid && match.player_two !== uid) {
      return res.json({ success: false, message: 'You are not a player in this match' });
    }
    
    // Return player-specific match data
    const matchData = MatchModel.createPlayerMatchObject(match, uid);
    return res.json({ success: true, data: matchData });
  } catch (e) {
    console.error('Error rejoining match:', e);
    return res.status(400).json({ success: false, message: e.message });
  }
});

// Apply rate limiting to match creation
app.post('/match', createMatchLimiter, createMatchHandler);

// Initialize express-ws and get the server instance
const { app: wsApp, getWss } = expressWs(app);

// WebSocket heartbeat to detect stale connections
const wss = getWss();
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => clearInterval(interval));

wsApp.ws('/match/:id', matchSocketHandler);

// Use the app's built-in listen (express-ws attaches to this)
app.listen(port, () => console.log(`Battleship server listening on port ${port}!`));

