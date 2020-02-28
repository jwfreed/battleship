const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const pool = require('./db');

const port = 3000;
const app = express();

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

app.listen(port, () => console.log(`Battleship server listening on port ${port}!`));
