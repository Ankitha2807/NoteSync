// routes/doubt.js
const express = require('express');
const router = express.Router();
const Doubt = require('../models/Doubt');
const authenticateUser = require('../middleware/authMiddleware');

// POST: Submit a new doubt
router.post('/', authenticateUser, async (req, res) => {
  const { title, description, postedBy, category } = req.body;
  
  if (!title || !description || !postedBy) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  try {
    const newDoubt = new Doubt({ 
      title, 
      description, 
      postedBy,
      category: category || 'Supplementary Queries'
    });
    await newDoubt.save();
    res.status(201).json(newDoubt);
  } catch (err) {
    console.error('Error posting doubt:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Fetch all doubts
router.get('/', async (req, res) => {
  try {
    const doubts = await Doubt.find().sort({ createdAt: -1 });
    res.status(200).json(doubts);
  } catch (err) {
    console.error('Error fetching doubts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Fetch doubts by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const doubts = await Doubt.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(doubts);
  } catch (err) {
    console.error('Error fetching doubts by category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;