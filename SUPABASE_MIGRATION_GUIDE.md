# Supabase PostgreSQL Migration Guide

## Overview
This guide will help you migrate your PowerLink Ethiopia application from local PostgreSQL to Supabase (cloud PostgreSQL).

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Create a new organization (free tier available)

## Step 2: Create a New Project

1. Click "New Project"
2. Fill in:
   - **Project Name**: PowerLink-Ethiopia
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to Ethiopia (e.g., Frankfurt, Mumbai, or Singapore)
   - **Pricing Plan**: Free (500MB database, 2GB bandwidth)
3. Wait 2-3 minutes for project setup

## Step 3: Get Database Connection Details

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Find the **Connection String** section
3. Copy the connection details:
   - **Host**: db.xxxxxxxxxxxxx.supabase.co
   - **Database name**: postgres
   - **Port**: 5432
   - **User**: postgres
   - **Password**: [your password from Step 2]

## Step 4: Update Backend Configuration

### 4.1 Update `.env` file

Replace your current database configuration in `backend/.env`:

```env
# Old local PostgreSQL
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=powerlink_db
# DB_USER=postgres
# DB_PASSWORD=your_password

# New Supabase PostgreSQL
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password

# Or use the full connection string
DATABASE_URL=postgresql://postgres:your_password@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

### 4.2 Update `backend/config/database.js` (if needed)

Your current config should work, but verify it supports SSL:

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = pool;
```

## Step 5: Create Database Tables

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Run each SQL file in order:

**Run these in order:**

```sql
-- 1. Create users table
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

-- 2. Create announcement1 table
CREATE TABLE IF NOT EXISTS announcement1 (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    date VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create outages table
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
    reported_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create service_requests table
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
    assigned_to INTEGER REFERENCES users(id),
    supervisor_notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_ticket_id ON service_requests(ticket_id);
CREATE INDEX IF NOT EXISTS idx_outages_status ON outages(status);
```

### Option B: Using Node.js Scripts

Run your existing initialization scripts:

```bash
cd backend
node scripts/db_init_notices.js
node scripts/db_init_outages.js
node scripts/db_init_service_requests.js
node scripts/create-admin.js
```

## Step 6: Test Connection

Create a test script `backend/scripts/test-supabase.js`:

```javascript
const pool = require('../config/database');

async function testConnection() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Connected to Supabase!');
        console.log('Server time:', result.rows[0].now);
        
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('\n📋 Tables:', tables.rows.map(r => r.table_name));
        
        await pool.end();
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
}

testConnection();
```

Run: `node scripts/test-supabase.js`

## Step 7: Migrate Existing Data (Optional)

If you have existing data to migrate:

### Export from local PostgreSQL:
```bash
pg_dump -U postgres -d powerlink_db -F c -f powerlink_backup.dump
```

### Import to Supabase:
1. Use Supabase SQL Editor
2. Or use pg_restore with Supabase connection string

## Step 8: Update File Upload Path

Since Supabase is cloud-based, consider using Supabase Storage for files:

1. Go to **Storage** in Supabase dashboard
2. Create a bucket named "service-documents"
3. Update upload logic to use Supabase Storage API

## Step 9: Security Considerations

### Enable Row Level Security (RLS)

In Supabase SQL Editor:

```sql
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE outages ENABLE ROW LEVEL SECURITY;

-- Create policies (example for service_requests)
CREATE POLICY "Users can view their own requests"
ON service_requests FOR SELECT
USING (auth.uid()::text = created_by::text);

CREATE POLICY "Supervisors can view all requests"
ON service_requests FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid()::integer 
        AND role IN ('supervisor', 'admin')
    )
);
```

## Step 10: Environment Variables for Production

For deployment, set these environment variables:

```env
NODE_ENV=production
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
JWT_SECRET=your_jwt_secret
```

## Supabase Free Tier Limits

- **Database**: 500 MB
- **Bandwidth**: 2 GB/month
- **API Requests**: Unlimited
- **Storage**: 1 GB
- **File Uploads**: 50 MB per file

## Advantages of Supabase

✅ Free tier with generous limits
✅ Automatic backups
✅ Built-in authentication (optional)
✅ Real-time subscriptions
✅ Auto-generated REST API
✅ File storage included
✅ No server maintenance
✅ Global CDN
✅ SSL/TLS by default

## Troubleshooting

### Connection Issues
- Check firewall settings
- Verify password is correct
- Ensure SSL is enabled in production

### Slow Queries
- Add indexes to frequently queried columns
- Use Supabase's query performance tools

### Storage Issues
- Migrate file uploads to Supabase Storage
- Clean up old/unused files

## Next Steps

1. ✅ Create Supabase account
2. ✅ Create project and get credentials
3. ✅ Update `.env` file
4. ✅ Run database initialization scripts
5. ✅ Test connection
6. ✅ Deploy backend to cloud (Render, Railway, or Vercel)
7. ✅ Deploy frontend to Vercel/Netlify

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- PostgreSQL Docs: https://www.postgresql.org/docs/
