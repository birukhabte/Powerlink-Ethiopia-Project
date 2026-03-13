const express = require('express');
const cors = require('cors');
const path = require('path');

// Force reload environment variables
delete require.cache[require.resolve('dotenv')];
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL || 'http://localhost:3000',
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test database connection
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: false
});

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

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'PowerLink Ethiopia API Server',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      test: '/api/test',
      auth: '/api/auth',
      announcements: '/api/announcements',
      users: '/api/users',
      outages: '/api/outages',
      serviceRequests: '/api/service-requests',
      uploads: '/api/uploads'
    }
  });
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
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
