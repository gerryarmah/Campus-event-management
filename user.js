const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Check if model already exists to prevent recompilation
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  preferences: {
    eventTypes: [{
      type: String,
      enum: ['workshop', 'seminar', 'club', 'sports', 'academic', 'social', 'career']
    }],
    notifications: {
      type: Boolean,
      default: true
    }
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
}));

// Hash password before saving
User.schema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = User;