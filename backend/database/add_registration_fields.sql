-- ============================================
-- Add Registration Fields to Users Table
-- Run this in Supabase SQL Editor
-- ============================================

-- Add new columns for comprehensive registration
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bp_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS woreda VARCHAR(100),
ADD COLUMN IF NOT EXISTS kebele VARCHAR(3),
ADD COLUMN IF NOT EXISTS house_plot_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS nearby_landmark VARCHAR(255),
ADD COLUMN IF NOT EXISTS account_type VARCHAR(20) DEFAULT 'individual',
ADD COLUMN IF NOT EXISTS organization_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS organization_type VARCHAR(100);

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_users_bp_number ON users(bp_number);
CREATE INDEX IF NOT EXISTS idx_users_city ON users(city);
CREATE INDEX IF NOT EXISTS idx_users_woreda ON users(woreda);
CREATE INDEX IF NOT EXISTS idx_users_account_type ON users(account_type);

-- Verify columns added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Registration fields added successfully!';
    RAISE NOTICE '📋 New fields: bp_number, city, woreda, kebele, house_plot_number, nearby_landmark, account_type, organization_name, organization_type';
END $$;
