// server/models/Pyq.js
const mongoose = require('mongoose');

const pyqSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String, required: true },
  userName: { type: String, default: 'Anonymous' },
  usn: { type: String, default: 'N/A' },
  role: { type: String, default: 'student' },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Pyq', pyqSchema);