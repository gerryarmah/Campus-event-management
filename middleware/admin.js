// backend/middleware/admin.js
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};