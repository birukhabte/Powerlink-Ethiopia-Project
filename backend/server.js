const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Enable CORS for all routes
app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true,
}));

// =====================
// Socket.IO Setup
// =====================
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  },
});

// Make io accessible from route handlers
app.set('io', io);

// =====================
// PORT
// =====================
const PORT = process.env.PORT || 5000;

// =====================
// MIDDLEWARE
// =====================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// =====================
// DATABASE
// =====================
const pool = require('./config/database');

// =====================
// ROUTES
// =====================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/outages', require('./routes/outages'));
app.use('/api/service-requests', require('./routes/service-requests'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/technician', require('./routes/technician'));

// =====================
// HEALTH CHECKS
// =====================
app.get('/', (req, res) => {
  res.send('<h1>PowerLink Ethiopia API</h1><p>The backend server is running correctly. Please access the application via the <a href="http://localhost:5174">frontend dashboard</a>.</p>');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// =====================
// SOCKET.IO LOGIC
// =====================
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  socket.on('user_joined', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their private room`);
    
    // Broadcast online status
    const onlineUsers = Array.from(io.sockets.adapter.rooms.keys())
      .filter(room => room.startsWith('user-'))
      .map(room => room.replace('user-', ''));
    io.emit('online_users', onlineUsers);
  });

  socket.on('send_message', (data) => {
    const { receiver_id, message } = data;
    io.to(`user-${receiver_id}`).emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// =====================
// START SERVER
// =====================
const startServer = (port) => {
  httpServer.listen(port, () => {
    console.log(`\n🚀 PowerLink Ethiopia Server running on port ${port}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? 'SET ✅' : 'MISSING ❌'}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Failed to start server:', err);
    }
  });
};

startServer(Number(PORT));

module.exports = { app, httpServer, io };
