// backend/routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Create new event (admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const event = new Event({
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      location: req.body.location,
      capacity: req.body.capacity,
      availableSeats: req.body.capacity,
      eventType: req.body.eventType,
      createdBy: req.user.userId
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// RSVP for an event
router.post('/:id/rsvp', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.availableSeats === 0) {
      return res.status(400).json({ error: 'Event is fully booked' });
    }

    // Check if user already RSVP'd
    if (event.registeredUsers.includes(req.user.userId)) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    event.registeredUsers.push(req.user.userId);
    event.availableSeats -= 1;
    await event.save();

    // Update user's registered events
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { registeredEvents: event._id }
    });

    res.json({ message: 'Successfully registered for event' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register for event' });
  }
});

// Cancel RSVP
router.delete('/:id/rsvp', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Remove user from registered users
    event.registeredUsers = event.registeredUsers.filter(
      userId => userId.toString() !== req.user.userId
    );
    event.availableSeats += 1;
    await event.save();

    // Remove event from user's registered events
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { registeredEvents: event._id }
    });

    res.json({ message: 'Successfully cancelled registration' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel registration' });
  }
});

module.exports = router;