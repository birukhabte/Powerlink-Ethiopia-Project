-- ============================================
-- PowerLink Ethiopia - Complete Database Schema
-- Copy and paste this into Supabase SQL Editor
-- ============================================

-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'customer',
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- 2. ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS announcement1 (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    date VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for announcements
CREATE INDEX IF NOT EXISTS idx_announcement1_type ON announcement1(type);
CREATE INDEX IF NOT EXISTS idx_announcement1_created_at ON announcement1(created_at);

-- 3. OUTAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS outages (
    id SERIAL PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    coordinates JSONB,
    outage_type VARCHAR(100),
    reason VARCHAR(255),
    description TEXT,
    estimated_affected VARCHAR(50),
    urgency VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'pending',
    reported_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for outages
CREATE INDEX IF NOT EXISTS idx_outages_status ON outages(status);
CREATE INDEX IF NOT EXISTS idx_outages_urgency ON outages(urgency);
CREATE INDEX IF NOT EXISTS idx_outages_reported_by ON outages(reported_by);
CREATE INDEX IF NOT EXISTS idx_outages_created_at ON outages(created_at);

-- 4. SERVICE REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS service_requests (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(50) UNIQUE NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(100),
    woreda VARCHAR(100),
    kebele VARCHAR(100),
    house_plot_number VARCHAR(100),
    nearby_landmark VARCHAR(255),
    full_address TEXT NOT NULL,
    documents JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(50) DEFAULT 'medium',
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    supervisor_notes TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for service_requests
CREATE INDEX IF NOT EXISTS idx_service_requests_ticket_id ON service_requests(ticket_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_priority ON service_requests(priority);
CREATE INDEX IF NOT EXISTS idx_service_requests_service_type ON service_requests(service_type);
CREATE INDEX IF NOT EXISTS idx_service_requests_created_by ON service_requests(created_by);
CREATE INDEX IF NOT EXISTS idx_service_requests_assigned_to ON service_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON service_requests(created_at);

-- ============================================
-- VERIFY TABLES CREATED
-- ============================================
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;

-- ============================================
-- INSERT SAMPLE ADMIN USER
-- ============================================
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (
    email, 
    username, 
    password_hash, 
    first_name, 
    last_name, 
    role
) VALUES (
    'admin@powerlink.et',
    'admin',
    '$2a$10$YourHashedPasswordWillBeHere',  -- You'll need to run create-admin script
    'System',
    'Administrator',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- SAMPLE ANNOUNCEMENT (Optional)
-- ============================================
INSERT INTO announcement1 (title, content, type, date) VALUES
('Welcome to PowerLink Ethiopia', 'Our new digital platform is now live! Report outages, track repairs, and manage your electricity services online.', 'info', '2024-01-15'),
('Scheduled Maintenance', 'Planned maintenance in Bole area on Saturday 8AM-12PM. Power will be temporarily interrupted.', 'warning', '2024-01-16')
ON CONFLICT DO NOTHING;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ All tables created successfully!';
    RAISE NOTICE '📋 Tables: users, announcement1, outages, service_requests';
    RAISE NOTICE '🔑 Next step: Run create-admin script to create admin user';
END $$;
