const express = require('express');
const multer = require('multer'); // Import multer
const Event = require('../models/event'); // Event model
const path = require('path'); // To handle file paths

const router = express.Router();

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Images/'); // Set the upload destination folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Create a unique filename
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Save with original file extension
  }
});

const upload = multer({ storage: storage }); // Initialize multer with storage options

// @route   GET /events
// @desc    Fetch all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching events', details: err });
  }
});

// @route   POST /events
// @desc    Create a new event
router.post('/', upload.fields([{ name: 'eventImage', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, date, time, location, capacity } = req.body;

    // Get the image paths (if any)
    const eventImage = req.files && req.files.eventImage ? `/images/${req.files.eventImage[0].filename}` : null;
    const backgroundImage = req.files && req.files.backgroundImage ? `/images/${req.files.backgroundImage[0].filename}` : null;

    const event = new Event({
      name,
      date,
      time,
      location,
      capacity,
      availableSeats: capacity,
      eventImage, // Store image path in DB
      backgroundImage, // Store background image path in DB
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: 'Error creating event', details: err });
  }
});

module.exports = router;
