const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'pigeon',
  host: 'localhost',
  port: '5432',
  database: 'weather_storage',
});

module.exports = pool;
