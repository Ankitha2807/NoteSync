//server/routes/document.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

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

module.exports = router;