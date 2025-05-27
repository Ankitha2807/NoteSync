// server/routes/pyq.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const Pyq = require('../models/pyq');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/pyqs');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup for PYQs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Upload a PYQ
router.post('/upload', upload.single('file'), async (req, res) => {
  const { subject, name } = req.body;
  const { file } = req;

  if (!subject || !name || !file) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newPyq = new Pyq({
      name,
      subject,
      filePath: file.path,
      fileType: file.mimetype,
      userName: req.body.userName || 'Anonymous',
      usn: req.body.usn || 'N/A',
      role: req.body.role || 'student'
    });
    await newPyq.save();
    res.status(201).json({ message: 'PYQ uploaded successfully', pyq: newPyq });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error uploading PYQ' });
  }
});

// Get PYQs by subject
router.get('/:subject', async (req, res) => {
  try {
    const subject = req.params.subject;
    const pyqs = await Pyq.find({ subject });
    res.json(pyqs);
  } catch (err) {
    console.error('Error in /:subject route:', err);
    res.status(500).json({ error: 'Error fetching PYQs' });
  }
});

// Download a PYQ
router.get('/download/:id', async (req, res) => {
  try {
    const pyq = await Pyq.findById(req.params.id);
    if (!pyq) {
      return res.status(404).json({ error: 'PYQ not found' });
    }
    res.download(pyq.filePath, `${pyq.name}.pdf`);
  } catch (err) {
    console.error('Error in /download/:id route:', err);
    res.status(500).json({ error: 'Error downloading PYQ' });
  }
});

// Admin route to delete a PYQ
router.delete('/:id', async (req, res) => {
  try {
    // Check if user is admin
    const { role } = req.body;
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const pyq = await Pyq.findById(req.params.id);
    if (!pyq) {
      return res.status(404).json({ error: 'PYQ not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(pyq.filePath)) {
      fs.unlinkSync(pyq.filePath);
    }

    // Delete from database
    await Pyq.findByIdAndDelete(req.params.id);
    res.json({ message: 'PYQ deleted successfully' });
  } catch (err) {
    console.error('Error deleting PYQ:', err);
    res.status(500).json({ error: 'Error deleting PYQ' });
  }
});

// Admin route to get all PYQs
router.get('/admin/all', async (req, res) => {
  try {
    // Check if user is admin
    const { role } = req.query;
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const pyqs = await Pyq.find().sort({ uploadedAt: -1 });
    res.json(pyqs);
  } catch (err) {
    console.error('Error fetching all PYQs:', err);
    res.status(500).json({ error: 'Error fetching PYQs' });
  }
});

module.exports = router;