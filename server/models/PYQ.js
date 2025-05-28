// server/models/PYQ.js 
const mongoose = require('mongoose');

const pyqSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  semester: { type: String, default: '1' },
  year: { type: String, required: true },
  examType: { 
    type: String, 
    enum: ['Mid-Sem', 'End-Sem', 'Quiz', 'Assignment', 'Other'], 
    default: 'End-Sem' 
  },
  filePath: { type: String, required: true },
  filename: { type: String, required: true }, // Add filename field
  fileSize: { type: Number, required: true }, // Add file size field
  fileType: { type: String, required: true },
  userName: { type: String, default: 'Anonymous' },
  usn: { type: String, default: 'N/A' },
  role: { type: String, default: 'student' },
  uploadDate: { type: Date, default: Date.now }, // Changed from uploadedAt
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PYQ', pyqSchema);