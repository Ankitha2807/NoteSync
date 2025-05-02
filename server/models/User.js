// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  usn: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;