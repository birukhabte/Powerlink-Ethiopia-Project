const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const pool = require('../config/database');

async function checkAdmin() {
    try {
        const result = await pool.query(
            `SELECT id, email, username, first_name, last_name, role, created_at 
             FROM users 
             WHERE role = 'admin' 
             ORDER BY created_at`
        );

        console.log('\n📋 Admin Users in Database:\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        if (result.rows.length === 0) {
            console.log('❌ No admin users found in database');
        } else {
            result.rows.forEach((user, index) => {
                console.log(`\nAdmin #${index + 1}:`);
                console.log(`  ID:         ${user.id}`);
                console.log(`  Email:      ${user.email}`);
                console.log(`  Username:   ${user.username}`);
                console.log(`  Name:       ${user.first_name} ${user.last_name}`);
                console.log(`  Role:       ${user.role}`);
                console.log(`  Created:    ${user.created_at}`);
            });
        }
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkAdmin();
