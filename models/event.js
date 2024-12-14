const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  eventImage: { type: String, default: null }, // Store relative path for event image
  backgroundImage: { type: String, default: null }, // Store relative path for background image
});

module.exports = mongoose.model('Event', eventSchema);
