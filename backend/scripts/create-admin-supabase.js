const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  host: 'aws-1-eu-west-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.dzgqffcebxrsbjyiitij',
  password: 'k7jeoEeP5iNBVefP',
  ssl: false
});

async function createAdmin() {
    try {
        console.log('\n🔧 Creating admin user in Supabase...\n');

        const adminData = {
            email: 'admin@powerlink.et',
            username: 'admin',
            password: 'admin123',
            firstName: 'System',
            lastName: 'Administrator',
            role: 'admin'
        };

        // Check if admin exists
        const existing = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [adminData.email]
        );

        if (existing.rows.length > 0) {
            console.log('⚠️  Admin already exists. Resetting password...');
            const passwordHash = await bcrypt.hash(adminData.password, 10);
            await pool.query(
                'UPDATE users SET password_hash = $1 WHERE email = $2',
                [passwordHash, adminData.email]
            );
            console.log('✅ Password updated!');
        } else {
            // Create new admin
            const passwordHash = await bcrypt.hash(adminData.password, 10);
            await pool.query(
                `INSERT INTO users (email, username, password_hash, first_name, last_name, role) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [adminData.email, adminData.username, passwordHash, adminData.firstName, adminData.lastName, adminData.role]
            );
            console.log('✅ Admin created!');
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:    ', adminData.email);
        console.log('🔑 Password: ', adminData.password);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        await pool.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createAdmin();
