// Input validation functions
const validateRegistration = (data) => {
  const { name, email, password } = data;

  // Name validation
  if (!name || name.trim().length < 2) {
      return 'Name must be at least 2 characters long';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
      return 'Please provide a valid email address';
  }

  // Password validation
  if (!password || password.length < 6) {
      return 'Password must be at least 6 characters long';
  }

  return null;
};

const validateLogin = (data) => {
  const { email, password } = data;

  if (!email || !password) {
      return 'Please provide both email and password';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      return 'Please provide a valid email address';
  }

  return null;
};

const validateEvent = (data) => {
  const { name, description, date, time, location, capacity } = data;

  if (!name || name.trim().length < 3) {
      return 'Event name must be at least 3 characters long';
  }

  if (!description || description.trim().length < 10) {
      return 'Description must be at least 10 characters long';
  }

  if (!date || !time) {
      return 'Please provide event date and time';
  }

  if (!location || location.trim().length < 3) {
      return 'Please provide a valid location';
  }

  if (!capacity || capacity < 1) {
      return 'Capacity must be at least 1';
  }

  return null;
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateEvent
};