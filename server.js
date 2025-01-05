const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
require('dotenv').config();

// Fix the import of routes, removing '.js' extension to ensure it's resolved correctly
const authRoutes = require('./routes/auth');  // Ensure 'auth.js' exists in the routes folder

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Connect to MongoDB before loading routes
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('📦 Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Welcome route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Campus Event Management API',
    documentation: '/api-docs',
    status: 'Server is running'
  });
});

// API Routes
app.use('/api/auth', authRoutes);  // Use the imported authRoutes
app.use('/api/events', require('./routes/events'));
app.use('/api/admin', require('./routes/admin'));

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join event room
  socket.on('join_event', (eventId) => {
    socket.join(`event_${eventId}`);
    console.log(`Socket ${socket.id} joined event_${eventId}`);
  });

  // Leave event room
  socket.on('leave_event', (eventId) => {
    socket.leave(`event_${eventId}`);
    console.log(`Socket ${socket.id} left event_${eventId}`);
  });

  // Event updates
  socket.on('event_update', (data) => {
    io.to(`event_${data.eventId}`).emit('event_updated', data);
    console.log('Event update emitted:', data);
  });

  // RSVP updates
  socket.on('rsvp_update', (data) => {
    io.emit('rsvp_updated', data);
    console.log('RSVP update emitted:', data);
  });

  // New event created
  socket.on('new_event', (data) => {
    io.emit('event_created', data);
    console.log('New event emitted:', data);
  });

  // Event deleted
  socket.on('event_deleted', (eventId) => {
    io.emit('event_removed', eventId);
    console.log('Event deletion emitted:', eventId);
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
    🚀 Server is running on port ${PORT}
    📱 Socket.IO is ready for connections
    🌐 API Documentation: http://localhost:${PORT}/api-docs
    🔧 Environment: ${process.env.NODE_ENV || 'development'}
    🎓 Campus Event Management System
    
    Available Routes:
    - Authentication: /api/auth
    - Events: /api/events
    - Admin: /api/admin
    
    Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Performing graceful shutdown...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('💤 Server and MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = { app, server, io };
