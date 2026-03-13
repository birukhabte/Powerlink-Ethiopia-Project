const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: false
});

async function removeAdmin() {
    try {
        console.log('\n�️  Removing admin user from Supabase...\n');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

        // Check if admin exists
        const existing = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [adminEmail]
        );

        if (existing.rows.length > 0) {
            // Remove the admin
            await pool.query(
                'DELETE FROM users WHERE email = $1',
                [adminEmail]
            );
            console.log('✅ Admin user removed successfully!');
        } else {
            console.log('⚠️  Admin user not found in database.');
        }

        await pool.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

removeAdmin();
