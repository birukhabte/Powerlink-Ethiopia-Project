# 🚀 Quick Start: Supabase Setup (5 Minutes)

## Step 1: Create Supabase Project
1. Go to https://supabase.com → Sign up
2. Create new project: `PowerLink-Ethiopia`
3. Save your database password!
4. Wait 2-3 minutes

## Step 2: Get Connection Details
1. Settings → Database
2. Copy these values:
   - Host: `db.xxxxx.supabase.co`
   - Password: `[your password]`

## Step 3: Update `.env` File
```env
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password_here
```

## Step 4: Create Users Table
1. Supabase → SQL Editor → New Query
2. Paste and run:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'customer',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Step 5: Test Connection
```bash
cd backend
node scripts/test-supabase-connection.js
```

## Step 6: Create Admin
```bash
node scripts/create-admin.js
```

## Step 7: Start Servers
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend/vite-project
npm run dev
```

## Step 8: Test Registration
1. Open http://localhost:5173
2. Click "Register"
3. Fill form and submit
4. Check Supabase → Table Editor → users

## ✅ Success!
If you see the new user in Supabase, you're done!

---

**Need detailed help?** See `SUPABASE_SETUP_PLAN.md`
