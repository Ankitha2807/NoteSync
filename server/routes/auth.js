// server/routes/auth.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/test', (req, res) => {
  res.status(200).json({ message: 'GET route working!' });
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// POST: Login route
router.post('/login', async (req, res) => {
  const { userName, usn, role } = req.body;
  
  try {
    // Validate input
    if (!userName || !usn || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Admin validation
    if (role === 'admin') {
      // Using hardcoded values for comparison to match the Login.js frontend validation
      if (userName !== 'admin' || usn !== '4MC25CS196') {
        return res.status(401).json({ message: 'Invalid Admin Credentials' });
      }
      
      return res.status(200).json({
        message: 'Admin login successful',
        user: { userName, usn, role },
      });
    }
    
    // Check if the user already exists
    let user = await User.findOne({ usn });
    
    if (!user) {
      // Create a new user if not found
      user = new User({ userName, usn, role });
      await user.save();
      console.log('New user created:', user);
    } else if (user.userName !== userName || user.role !== role) {
      // Update existing user if data doesn't match
      user.userName = userName;
      user.role = role;
      await user.save();
      console.log('User updated:', user);
    }
    
    // Respond with user data
    res.status(200).json({
      message: 'Login successful',
      user,
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;