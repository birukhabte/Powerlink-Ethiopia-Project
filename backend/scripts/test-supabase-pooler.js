const { Pool } = require('pg');
const path = require('path');

// Force reload .env
delete require.cache[require.resolve('dotenv')];
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

console.log('\n🔍 Testing Supabase Connection Pooler...\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Host:    ', process.env.DB_HOST);
console.log('Port:    ', process.env.DB_PORT);
console.log('Database:', process.env.DB_NAME);
console.log('User:    ', process.env.DB_USER);
console.log('Password:', process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-4) : 'NOT SET');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

async function test() {
    try {
        console.log('Test 1: Connecting to Supabase...');
        const result = await pool.query('SELECT NOW() as server_time, version() as postgres_version');
        console.log('✅ Connected successfully!');
        console.log('   Server time:', result.rows[0].server_time);
        console.log('   PostgreSQL:', result.rows[0].postgres_version.split(',')[0]);
        
        console.log('\nTest 2: Listing tables...');
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);
        
        if (tables.rows.length === 0) {
            console.log('⚠️  No tables found. You need to create tables.');
        } else {
            console.log('✅ Tables found:');
            tables.rows.forEach(row => {
                console.log('   -', row.table_name);
            });
        }
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Supabase connection successful!\n');
        
        await pool.end();
        process.exit(0);
        
    } catch (error) {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ Connection failed!');
        console.error('Error:', error.message);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        process.exit(1);
    }
}

test();
