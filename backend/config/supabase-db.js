const { Pool } = require('pg');

// Direct Supabase connection - no caching issues
const pool = new Pool({
  host: 'aws-1-eu-west-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.dzgqffcebxrsbjyiitij',
  password: 'k7jeoEeP5iNBVefP',
  ssl: false
});

pool.on('connect', () => {
  console.log('✅ Connected to Supabase database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err.message);
});

module.exports = pool;
