const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

pool.on('connect', () => console.log('Connected to PostgreSQL database'));
pool.on('error', (err) => console.error('Database connection error:', err));

module.exports = pool;
