const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');
const bodyParser = require('body-parser');
const createMatchHandler = require('./handlers/createMatch');
const matchSocketHandler = require('./handlers/matchSocket');

const port = process.env.PORT;
const app = express();
const ews = expressWs(app);

app.use(cors());
app.use(bodyParser.json());

app.post('/match', createMatchHandler);

app.ws('/match/:id', matchSocketHandler);

app.listen(port, () => console.log(`Battleship server listening on port ${port}!`));
