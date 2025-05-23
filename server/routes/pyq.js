const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure the upload directory exists
const pyqDir = path.join(__dirname, '..', 'uploads', 'pyqs');
if (!fs.existsSync(pyqDir)) {
  fs.mkdirSync(pyqDir, { recursive: true });
}

// Multer config for storing only PYQ files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, pyqDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.status(200).json({
    message: 'PYQ uploaded successfully',
    filePath: `/uploads/pyqs/${req.file.filename}`,
  });
});

module.exports = router;
