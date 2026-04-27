const pool = require('../config/database');

async function addSpecialCustomerField() {
    try {
        console.log('Adding special_customer field to users table...');

        // Add special_customer column
        await pool.query(`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS special_customer BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS special_type VARCHAR(100),
            ADD COLUMN IF NOT EXISTS bp_number VARCHAR(50)
        `);

        console.log('✅ Special customer fields added successfully');

        // Create index for special customers
        await pool.query('CREATE INDEX IF NOT EXISTS idx_users_special_customer ON users(special_customer)');

        console.log('✅ Index created for special customers');

    } catch (error) {
        console.error('❌ Error adding special customer fields:', error);
        throw error;
    }
}

module.exports = { addSpecialCustomerField };

// Run if called directly
if (require.main === module) {
    addSpecialCustomerField()
        .then(() => {
            console.log('Migration completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Migration failed:', error);
            process.exit(1);
        });
}