// server/routes/pyq.js 
const express = require('express');
const multer = require('multer');
const router = express.Router();
const PYQ = require('../models/PYQ');
const path = require('path');
const fs = require('fs');

// Enhanced middleware to check if user is admin with strict validation
const isAdmin = (req, res, next) => {
  const { adminPassword } = req.body;
  const adminPass = req.headers['admin-password'];
  const role = req.headers['user-role'];
  const authorization = req.headers['authorization'];
  
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  
  console.log('Admin check - Password provided:', !!adminPassword || !!adminPass);
  console.log('Admin check - Role:', role);
  console.log('Admin check - Has Authorization:', !!authorization);
  
  // Check for admin password in body or headers
  const hasValidPassword = (adminPassword && adminPassword === ADMIN_PASSWORD) || 
                          (adminPass && adminPass === ADMIN_PASSWORD);
  
  // Must have valid password AND admin role AND authorization token
  if (hasValidPassword && role === 'admin' && authorization) {
    console.log('Admin access granted');
    next();
  } else {
    console.log('Admin access denied - Invalid credentials');
    console.log('- Valid Password:', hasValidPassword);
    console.log('- Admin Role:', role === 'admin');
    console.log('- Has Token:', !!authorization);
    
    return res.status(403).json({ 
      error: 'Admin access required',
      details: 'Valid admin password, role, and authorization required'
    });
  }
};

// Middleware to verify admin credentials for sensitive operations
const verifyAdminCredentials = (req, res, next) => {
  const role = req.headers['user-role'];
  const authorization = req.headers['authorization'];
  
  // Check if user claims to be admin
  if (role !== 'admin' || !authorization) {
    return res.status(401).json({ 
      error: 'Unauthorized access',
      details: 'Admin privileges required'
    });
  }
  
  next();
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

// Upload route - Available to all users
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
      semester: req.body.semester || '1',
      year,
      examType: examType || 'End-Sem',
      filePath: file.path,
      filename: file.filename,
      fileSize: file.size,
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
    
    res.json({ data: pyqs });
  } catch (err) {
    console.error('Error in /:subject route:', err);
    res.status(500).json({ error: 'Error fetching PYQs' });
  }
});

// Download a PYQ - Available to all users
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

// Verify admin credentials - Enhanced security with role check
router.post('/verify-admin', verifyAdminCredentials, (req, res) => {
  const { password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  
  console.log('Admin verification attempt');
  
  if (!password) {
    return res.status(400).json({ 
      valid: false, 
      error: 'Password is required' 
    });
  }
  
  if (password === ADMIN_PASSWORD) {
    console.log('Admin verification successful');
    res.json({ valid: true, message: 'Admin credentials verified' });
  } else {
    console.log('Admin verification failed - Invalid password');
    res.status(401).json({ 
      valid: false, 
      error: 'Invalid admin password' 
    });
  }
});

// Verify admin status endpoint
router.get('/auth/verify-admin', (req, res) => {
  const adminToken = req.headers['authorization'];
  const role = req.headers['user-role'];
  
  console.log('Admin status verification - Role:', role, 'Token:', !!adminToken);
  
  // Check if user has admin role and authorization token
  if (role === 'admin' && adminToken) {
    res.json({ 
      isAdmin: true, 
      message: 'Admin status confirmed' 
    });
  } else {
    res.json({ 
      isAdmin: false, 
      message: 'Not an admin user' 
    });
  }
});

// DELETE ROUTE - STRICT ADMIN ONLY with enhanced security checks
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    console.log('Delete request for PYQ:', req.params.id);
    console.log('Delete request from user role:', req.headers['user-role']);
    
    const pyq = await PYQ.findById(req.params.id);
    
    if (!pyq) {
      return res.status(404).json({ error: 'PYQ not found' });
    }

    // Additional security log
    console.log(`Admin ${req.headers['user-role']} attempting to delete PYQ: ${pyq.name} (${pyq.year})`);

    // Delete the physical file from pyq-uploads folder
    if (fs.existsSync(pyq.filePath)) {
      fs.unlinkSync(pyq.filePath);
      console.log('Physical file deleted:', pyq.filePath);
    } else {
      console.log('Physical file not found, proceeding with database deletion');
    }

    // Delete the PYQ record from database
    await PYQ.findByIdAndDelete(req.params.id);
    console.log('PYQ record deleted from database');
    
    res.json({ 
      message: 'PYQ deleted successfully',
      deletedPYQ: {
        id: pyq._id,
        name: pyq.name,
        year: pyq.year,
        subject: pyq.subject
      }
    });
  } catch (err) {
    console.error('Error deleting PYQ:', err);
    res.status(500).json({ 
      error: 'Error deleting PYQ',
      details: err.message 
    });
  }
});

// Get all PYQs (Admin only) - Enhanced security
router.get('/admin/all', isAdmin, async (req, res) => {
  try {
    console.log('Fetching all PYQs for admin user:', req.headers['user-role']);
    const pyqs = await PYQ.find({}).sort({ uploadedAt: -1 });
    
    res.json({
      message: 'PYQs fetched successfully',
      count: pyqs.length,
      data: pyqs
    });
  } catch (err) {
    console.error('Error fetching all PYQs:', err);
    res.status(500).json({ 
      error: 'Error fetching PYQs',
      details: err.message 
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  if (error.message.includes('Only PDF, DOC, DOCX, JPG, JPEG, PNG files are allowed!')) {
    return res.status(400).json({ error: error.message });
  }
  
  console.error('Unexpected error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = router;