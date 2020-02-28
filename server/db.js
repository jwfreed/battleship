const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'battleship',
  password: 'j0nfr33d',
  port: 5432
});

module.exports = pool;
