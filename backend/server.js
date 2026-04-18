const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);

// =====================
// ALLOWED ORIGINS
// =====================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://industrial-project-xi.vercel.app"
];

// =====================
// CORS CONFIG (FIXED)
// =====================
const corsOptions = {
  origin: function (origin, callback) {
    console.log("Incoming Origin:", origin);

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn("CORS fallback allowed for:", origin);
    return callback(null, true);
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true
};

// Apply CORS
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// =====================
// SOCKET.IO
// =====================
const io = new Server(server, {
  cors: corsOptions
});

// =====================
// PORT
// =====================
const PORT = process.env.PORT || 5000;

// =====================
// MIDDLEWARE
// =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =====================
// DATABASE
// =====================
const pool = require('./config/database');

// Test DB
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      message: 'Database connected successfully!',
      timestamp: result.rows[0].now
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Database connection failed',
      details: error.message
    });
  }
});

// =====================
// ROOT
// =====================
app.get('/', (req, res) => {
  res.json({
    message: 'PowerLink Ethiopia API Server',
    status: 'running',
    version: '1.0.0'
  });
});

// =====================
// HEALTH CHECK
// =====================
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// =====================
// ROUTES
// =====================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/users', require('./routes/users'));
app.use('/api/outages', require('./routes/outages'));
app.use('/api/service-requests', require('./routes/service-requests'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/schedule', require('./routes/schedule'));

// =====================
// SOCKET EVENTS
// =====================
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user_joined', (userId) => {
    socket.join(`user-${userId}`);
  });

  socket.on('send_message', (message) => {
    io.to(`user-${message.receiver_id}`).emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// =====================
// START SERVER
// =====================
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
