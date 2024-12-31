// app.js - Backend entry point

// Import required modules
require('dotenv').config();  // Load environment variables from .env file
const express = require('express');  // Express framework
const mongoose = require('mongoose');  // MongoDB connection using mongoose
const authRoutes = require('./routes/auth');  // Import auth routes (for login, registration)
const eventsRoutes = require('./routes/events');  // Import event-related routes

const app = express();  // Create an Express app instance

const PORT = process.env.PORT || 3000;  // Set the server port, defaults to 3000
const MONGO_URI = process.env.MONGO_URI;  // MongoDB connection URI
const JWT_SECRET = process.env.JWT_SECRET;  // JWT secret for secure authentication

// Middleware
app.use(express.json());  // Parse incoming JSON requests

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// API routes (must come before the catch-all route)
app.use('/auth', authRoutes);  // Add authentication routes (login, registration, etc.)
app.use('/events', eventsRoutes);  // Add event-related routes (CRUD operations for events)

// Basic home route for testing
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Serve React frontend for production (must be last)
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static('client/build'));  // Serve static files from the React frontend
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));  // Catch-all route for frontend
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Check MongoDB connection health (optional but useful)
app.get('/test-db', async (req, res) => {
  try {
    await mongoose.connection.db.command({ ping: 1 });
    res.json({ message: 'Database connection is healthy' });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Debugging logs
console.log('Server script executed');
console.log(`Connecting to MongoDB at ${MONGO_URI}`);
console.log(`JWT secret: ${JWT_SECRET}`);
