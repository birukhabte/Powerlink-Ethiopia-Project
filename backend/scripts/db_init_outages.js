const pool = require('../config/database');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const createOutagesTable = async () => {
    try {
        console.log('🔧 Initializing outage_reports table...');

        const query = `
            CREATE TABLE IF NOT EXISTS outage_reports (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                outage_type VARCHAR(100) NOT NULL,
                urgency VARCHAR(50) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
                status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in-progress', 'resolved', 'cancelled')),
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                address TEXT,
                estimated_affected VARCHAR(100),
                reason TEXT,
                technician_notes TEXT,
                reported_by INTEGER,
                assigned_to INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Create indexes for better performance
            CREATE INDEX IF NOT EXISTS idx_outage_reports_status ON outage_reports(status);
            CREATE INDEX IF NOT EXISTS idx_outage_reports_created_at ON outage_reports(created_at);
            CREATE INDEX IF NOT EXISTS idx_outage_reports_location ON outage_reports(latitude, longitude);
            CREATE INDEX IF NOT EXISTS idx_outage_reports_urgency ON outage_reports(urgency);
        `;z

        await pool.query(query);
        console.log('✅ Outage_reports table created successfully!');
        console.log('✅ Indexes created successfully!');

        await pool.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error creating outage_reports table:', error);
        process.exit(1);
    }
};

createOutagesTable();
