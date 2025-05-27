// server/routes/document.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

// Middleware to check if user is admin (without JWT)
const isAdmin = (req, res, next) => {
  // Check admin credentials from request body or headers
  const { adminPassword, userRole } = req.body;
  const adminPass = req.headers['admin-password'];
  const role = req.headers['user-role'];
  
  // You can set your admin password here or use environment variable
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  
  // Check if admin password is provided and correct, or if role is admin
  if ((adminPassword && adminPassword === ADMIN_PASSWORD) || 
      (adminPass && adminPass === ADMIN_PASSWORD) ||
      (userRole === 'admin') || 
      (role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ error: 'Admin access required' });
  }
};

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Upload a document
router.post('/upload', upload.single('file'), async (req, res) => {
  const { subject, name } = req.body;
  const { file } = req;

  if (!subject || !name || !file) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newDocument = new Document({
      name,
      subject,
      filePath: file.path,
      fileType: file.mimetype,
      userName: req.body.userName || 'Anonymous',
      usn: req.body.usn || 'N/A',
      role: req.body.role || 'student'
    });
    await newDocument.save();
    res.status(201).json({ message: 'Document uploaded successfully', document: newDocument });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error uploading document' });
  }
});

// Get documents by subject
router.get('/:subject', async (req, res) => {
  try {
    const subject = req.params.subject;
    const documents = await Document.find({ subject });
    res.json(documents);
  } catch (err) {
    console.error('Error in /:subject route:', err);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Download a document
router.get('/download/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.download(document.filePath, `${document.name}.pdf`);
  } catch (err) {
    console.error('Error in /download/:id route:', err);
    res.status(500).json({ error: 'Error downloading document' });
  }
});

// DELETE ROUTE - Admin only (without JWT)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete the physical file from uploads folder
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // Delete the document record from database
    await Document.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error('Error deleting document:', err);
    res.status(500).json({ error: 'Error deleting document' });
  }
});

// Get all documents (Admin only - for management purposes)
router.get('/admin/all', isAdmin, async (req, res) => {
  try {
    const documents = await Document.find({}).sort({ uploadedAt: -1 });
    res.json(documents);
  } catch (err) {
    console.error('Error fetching all documents:', err);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

module.exports = router;