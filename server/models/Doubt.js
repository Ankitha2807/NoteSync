//server/models/Doubt.js
const mongoose = require('mongoose');

// Answer schema as a subdocument
const answerSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  usn: { type: String, required: true },
  role: { type: String, required: true },
  answerText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Main doubt schema
const doubtSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  usn: { type: String, required: true },
  role: { type: String, required: true },
  questionText: { type: String, required: true },
  answers: [answerSchema],  // Array of answers
  isResolved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Doubt', doubtSchema);