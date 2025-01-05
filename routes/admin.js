const express = require('express');
const router = express.Router();

// Your route logic here, e.g.
router.get('/', (req, res) => {
  res.json({ message: 'Admin route' });
});

module.exports = router;
