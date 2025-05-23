const mongoose = require('mongoose');

const pyqSchema = new mongoose.Schema({
  name: String,
  subject: String,
  filePath: String,
  fileType: String,
  uploadedBy: {
    userName: String,
    usn: String,
    role: String,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PYQ', pyqSchema);  // ✅ Collection will be pyqs
