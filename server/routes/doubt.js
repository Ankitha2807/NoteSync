// server/routes/doubt.js
const express = require('express');
const router = express.Router();
const Doubt = require('../models/Doubt');
const authMiddleware = require('../middleware/authMiddleware');

// Fixed route order - search route needs to come before /:id routes!
// 1. GET route to search for doubts
router.get('/search', async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }
  
  try {
    const doubts = await Doubt.find({
      questionText: { $regex: query, $options: 'i' }
    }).sort({ createdAt: -1 });
    
    res.status(200).json(doubts);
  } catch (error) {
    console.error('❌ Error searching doubts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 2. POST route to ask a new doubt
router.post('/ask', authMiddleware, async (req, res) => {
  const { questionText, userName, usn, role } = req.body;
  
  if (!questionText || !userName || !usn || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if a similar doubt already exists
    const similarDoubt = await Doubt.findOne({
      questionText: { $regex: questionText, $options: 'i' } // Case-insensitive partial match
    });
    
    // If similar doubt found, return it
    if (similarDoubt) {
      return res.status(200).json({ 
        message: 'Similar doubt already exists',
        doubt: similarDoubt,
        isDuplicate: true
      });
    }

    // Create new doubt if no similar one exists
    const newDoubt = new Doubt({
      userName,
      usn,
      role,
      questionText,
      answers: [],
    });

    await newDoubt.save();

    return res.status(201).json({ 
      message: 'Doubt submitted successfully',
      doubt: newDoubt
    });
  } catch (error) {
    console.error('❌ Error saving doubt:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 3. GET route to fetch all doubts (with pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get category filter if provided
    const category = req.query.category;
    const query = category && category !== 'All' ? { category } : {};
    
    const doubts = await Doubt.find(query)
      .sort({ createdAt: -1 }) // Latest first
      .skip(skip)
      .limit(limit);
      
    const total = await Doubt.countDocuments(query);
    
    res.status(200).json({
      doubts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('❌ Error fetching doubts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 4. GET route to fetch a single doubt by ID
router.get('/:id', async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }
    
    res.status(200).json(doubt);
  } catch (error) {
    console.error('❌ Error fetching doubt:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 5. POST route to add an answer to a doubt
router.post('/:id/answer', authMiddleware, async (req, res) => {
  const { answerText, userName, usn, role } = req.body;
  
  if (!answerText || !userName || !usn || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  try {
    const doubt = await Doubt.findById(req.params.id);
    
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }
    
    // Initialize answers array if it doesn't exist
    if (!doubt.answers) {
      doubt.answers = [];
    }
    
    // Add the new answer
    doubt.answers.push({
      userName,
      usn,
      role,
      answerText,
      createdAt: new Date()
    });
    
    await doubt.save();
    
    res.status(201).json({ 
      message: 'Answer added successfully',
      doubt
    });
  } catch (error) {
    console.error('❌ Error adding answer:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 6. PATCH route to mark a doubt as resolved
router.patch('/:id/resolve', authMiddleware, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }
    
    // Only allow the original asker to mark as resolved
    if (doubt.usn !== req.body.usn) {
      return res.status(403).json({ message: 'Only the original asker can mark as resolved' });
    }
    
    doubt.isResolved = true;
    await doubt.save();
    
    res.status(200).json({ 
      message: 'Doubt marked as resolved',
      doubt
    });
  } catch (error) {
    console.error('❌ Error resolving doubt:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Alternative POST route to delete a doubt (Admin only) - for compatibility
router.post('/:id/delete', authMiddleware, async (req, res) => {
  const { usn, role } = req.body;
  
  try {
    console.log('Delete request received for doubt:', req.params.id);
    console.log('User data:', { usn, role });
    
    // Check if user is admin
    const isAdmin = usn === process.env.ADMIN_USN || role === 'admin';
    console.log('Is admin:', isAdmin, 'Admin USN:', process.env.ADMIN_USN);
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can delete doubts' });
    }
    
    const doubt = await Doubt.findById(req.params.id);
    
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }
    
    await Doubt.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ 
      message: 'Doubt deleted successfully',
      doubtId: req.params.id
    });
  } catch (error) {
    console.error('❌ Error deleting doubt:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 7. DELETE route to delete a doubt (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { usn, role } = req.body;
  
  try {
    // Check if user is admin
    const isAdmin = usn === process.env.ADMIN_USN || role === 'admin';
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can delete doubts' });
    }
    
    const doubt = await Doubt.findById(req.params.id);
    
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }
    
    await Doubt.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ 
      message: 'Doubt deleted successfully',
      doubtId: req.params.id
    });
  } catch (error) {
    console.error('❌ Error deleting doubt:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 8. DELETE route to delete an answer from a doubt (Admin only)
router.delete('/:doubtId/answer/:answerId', authMiddleware, async (req, res) => {
  const { usn, role } = req.body;
  
  try {
    // Check if user is admin
    const isAdmin = usn === process.env.ADMIN_USN || role === 'admin';
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can delete answers' });
    }
    
    const doubt = await Doubt.findById(req.params.doubtId);
    
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }
    
    // Remove the answer from the answers array
    doubt.answers = doubt.answers.filter(answer => answer._id.toString() !== req.params.answerId);
    
    await doubt.save();
    
    res.status(200).json({ 
      message: 'Answer deleted successfully',
      doubt
    });
  } catch (error) {
    console.error('❌ Error deleting answer:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Debug route to check if routes are working
router.get('/debug/routes', (req, res) => {
  res.json({ 
    message: 'Doubt routes are working',
    availableRoutes: [
      'GET /doubts/search',
      'POST /doubts/ask',
      'GET /doubts/',
      'GET /doubts/:id',
      'POST /doubts/:id/answer',
      'PATCH /doubts/:id/resolve',
      'DELETE /doubts/:id',
      'DELETE /doubts/:doubtId/answer/:answerId'
    ]
  });
});

module.exports = router;