const express = require('express');
const cors = require('cors');
const path = require('path');

// Force reload environment variables
delete require.cache[require.resolve('dotenv')];
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test database connection
const pool = require('./config/supabase-db');

// Test route
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Database connected successfully!',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      error: 'Database connection failed',
      details: error.message
    });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/users', require('./routes/users'));
app.use('/api/outages', require('./routes/outages'));
app.use('/api/service-requests', require('./routes/service-requests'));
app.use('/api/uploads', require('./routes/uploads'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});