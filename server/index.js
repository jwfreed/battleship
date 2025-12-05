require('dotenv').config();
const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');
const bodyParser = require('body-parser');
const createMatchHandler = require('./handlers/createMatch');
const matchSocketHandler = require('./handlers/matchSocket');

const port = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/match', createMatchHandler);

// Initialize express-ws and get the server instance
const { app: wsApp, getWss } = expressWs(app);

wsApp.ws('/match/:id', matchSocketHandler);

// Use the app's built-in listen (express-ws attaches to this)
app.listen(port, () => console.log(`Battleship server listening on port ${port}!`));

