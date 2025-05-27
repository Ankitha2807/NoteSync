const express = require('express');
const multer = require('multer');
const router = express.Router();
const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Admin access required' });
  }
};

// Auth middleware (non-JWT-based, using req.body)
const authenticateUser = (req, res, next) => {
  const { userName, usn, role } = req.body;

  if (!userName || !usn || !role) {
    return res.status(401).json({ 
      error: 'Unauthorized: Missing user info',
      received: req.body 
    });
  }

  req.user = { userName, usn, role };
  next();
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
      role: req.body.role || 'student',
    });
    await newDocument.save();
    res.status(201).json({ message: 'Document uploaded successfully', document: newDocument });
  } catch (err) {
    console.error('Error uploading document:', err);
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
    console.error('Error fetching documents:', err);
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
    console.error('Error downloading document:', err);
    res.status(500).json({ error: 'Error downloading document' });
  }
});

// DELETE ROUTE - Admin only
router.delete('/:id', authenticateUser, isAdmin, async (req, res) => {
  try {
    const documentId = req.params.id;

    // Validate document ID
    if (!documentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid document ID format' });
    }

    // Find the document in the database
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check if the file exists before deletion
    try {
      if (fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath); // Delete the file
      } else {
        console.warn(`File not found at path: ${document.filePath}`);
      }
    } catch (fileError) {
      console.error('Error deleting file:', fileError.message, fileError.stack);
      // Continue with database deletion, even if file deletion fails
    }

    // Delete the document from the database
    await Document.findByIdAndDelete(documentId);

    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error('Error deleting document:', err.message, err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
