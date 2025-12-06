require('dotenv').config();
const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const createMatchHandler = require('./handlers/createMatch');
const matchSocketHandler = require('./handlers/matchSocket');
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

