// server/routes/pyq.js 
const express = require('express');
const multer = require('multer');
const router = express.Router();
const PYQ = require('../models/PYQ');
const path = require('path');
const fs = require('fs');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  const { adminPassword, userRole } = req.body;
  const adminPass = req.headers['admin-password'];
  const role = req.headers['user-role'];
  
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  
  if ((adminPassword && adminPassword === ADMIN_PASSWORD) || 
      (adminPass && adminPass === ADMIN_PASSWORD) ||
      (userRole === 'admin') || 
      (role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ error: 'Admin access required' });
  }
};

// Ensure pyq-uploads directory exists
const uploadsDir = path.join(__dirname, '../../pyq-uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup for PYQs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `PYQ-${Date.now()}-${sanitizedOriginalName}`);
  },
});

const upload = multer({ 
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, JPG, JPEG, PNG files are allowed!'));
    }
  }
});

// FIXED: Upload route - moved to /upload instead of /uploads
router.post('/upload', upload.single('file'), async (req, res) => {
  console.log('Upload route hit');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  
  const { subject, name, year, examType } = req.body;
  const { file } = req;

  if (!subject || !name || !year || !file) {
    return res.status(400).json({ error: 'Subject, name, year, and file are required' });
  }

  try {
    const newPYQ = new PYQ({
      name,
      subject,
      semester: req.body.semester || '1', // Add default semester
      year,
      examType: examType || 'End-Sem',
      filePath: file.path,
      filename: file.filename, // Add filename field
      fileSize: file.size, // Add file size
      fileType: file.mimetype,
      userName: req.body.userName || 'Anonymous',
      usn: req.body.usn || 'N/A',
      role: req.body.role || 'student'
    });
    
    await newPYQ.save();
    console.log('PYQ saved successfully:', newPYQ);
    res.status(201).json({ message: 'PYQ uploaded successfully', pyq: newPYQ });
  } catch (err) {
    console.error('Error saving PYQ:', err);
    res.status(500).json({ error: 'Error uploading PYQ' });
  }
});

// Get PYQs by subject
router.get('/:subject', async (req, res) => {
  try {
    const subject = decodeURIComponent(req.params.subject);
    console.log('Fetching PYQs for subject:', subject);
    
    const pyqs = await PYQ.find({ subject }).sort({ year: -1, uploadedAt: -1 });
    console.log('Found PYQs:', pyqs.length);
    
    res.json({ data: pyqs }); // Return in expected format
  } catch (err) {
    console.error('Error in /:subject route:', err);
    res.status(500).json({ error: 'Error fetching PYQs' });
  }
});

// Download a PYQ
router.get('/download/:id', async (req, res) => {
  try {
    const pyq = await PYQ.findById(req.params.id);
    if (!pyq) {
      return res.status(404).json({ error: 'PYQ not found' });
    }
    
    const filename = pyq.filename || `${pyq.name}-${pyq.year}.pdf`;
    res.download(pyq.filePath, filename);
  } catch (err) {
    console.error('Error in /download/:id route:', err);
    res.status(500).json({ error: 'Error downloading PYQ' });
  }
});

// Verify admin credentials
router.post('/verify-admin', (req, res) => {
  const { password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (password === ADMIN_PASSWORD) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
});

// DELETE ROUTE - Admin only
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const pyq = await PYQ.findById(req.params.id);
    
    if (!pyq) {
      return res.status(404).json({ error: 'PYQ not found' });
    }

    // Delete the physical file from pyq-uploads folder
    if (fs.existsSync(pyq.filePath)) {
      fs.unlinkSync(pyq.filePath);
    }

    // Delete the PYQ record from database
    await PYQ.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'PYQ deleted successfully' });
  } catch (err) {
    console.error('Error deleting PYQ:', err);
    res.status(500).json({ error: 'Error deleting PYQ' });
  }
});

// Get all PYQs (Admin only)
router.get('/admin/all', isAdmin, async (req, res) => {
  try {
    const pyqs = await PYQ.find({}).sort({ uploadedAt: -1 });
    res.json(pyqs);
  } catch (err) {
    console.error('Error fetching all PYQs:', err);
    res.status(500).json({ error: 'Error fetching PYQs' });
  }
});

module.exports = router;