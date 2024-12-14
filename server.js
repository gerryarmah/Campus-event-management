const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');  // Add path for handling static files

const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to serve static files (images)
app.use('/images', express.static(path.join(__dirname, 'Images')));  // Serve files from Images folder

// Middleware
app.use(express.json());  // Parse incoming JSON requests
const corsOptions = {
  origin: 'http://localhost:3001',  // Allow frontend to make requests to this backend
  methods: 'GET,POST,PUT,DELETE',  // Allow necessary methods
  credentials: true,  // Allow cookies and authentication headers
};
app.use(cors(corsOptions));

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// API routes
app.use('/auth', authRoutes);
app.use('/events', eventsRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Serve React frontend for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
