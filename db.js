require('dotenv').config(); 

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
console.log("Using DB URL:", process.env.DATABASE_URL);
