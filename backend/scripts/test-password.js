const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'powerlink_db',
  user: 'postgres',
  password: '@bura123',
  ssl: false
});

async function test() {
    try {
        console.log('Testing connection with password: @bura123');
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Connected successfully!');
        console.log('Time:', result.rows[0].now);
        await pool.end();
    } catch (error) {
        console.log('❌ Failed:', error.message);
        
        // Try without @ symbol
        const pool2 = new Pool({
            host: 'localhost',
            port: 5432,
            database: 'powerlink_db',
            user: 'postgres',
            password: 'bura123',
            ssl: false
        });
        
        try {
            console.log('\nTrying without @ symbol: bura123');
            const result2 = await pool2.query('SELECT NOW()');
            console.log('✅ Connected successfully with: bura123');
            console.log('Time:', result2.rows[0].now);
            await pool2.end();
        } catch (error2) {
            console.log('❌ Also failed:', error2.message);
        }
    }
}

test();
