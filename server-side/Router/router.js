const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Adjust the path accordingly

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

module.exports = router;