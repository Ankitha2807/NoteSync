//server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const authMiddleware = require('./middleware/authMiddleware');

// Import routes
const authRoute = require('./routes/auth');
const doubtRoute = require('./routes/doubt'); // Make sure this path is correct

dotenv.config(); // Load environment variables

const app = express();

// ------------------ MIDDLEWARE SETUP ------------------ //
app.use(helmet()); // Adds security headers
app.use(cors({ origin: '*' })); // Enable CORS
app.use(express.json()); // Parse incoming JSON
app.use(morgan('dev')); // Log HTTP requests

// Debug incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Body:`, req.body);
  next();
});

// ------------------ ROUTE SETUP ------------------ //
app.use('/api/auth', authRoute);   // For user login/register
app.use('/api/doubts', doubtRoute); // For asking/answering doubts

// Test route to verify the server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// ------------------ MONGODB CONNECTION ------------------ //
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Stop the app if DB connection fails
  });

// ------------------ ERROR HANDLING ------------------ //
// Handle unmatched routes
app.use((req, res, next) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Handle server errors
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack || err.message);
  res.status(500).json({ message: 'Internal Server Error' });
});

// ------------------ SERVER START ------------------ //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Routes registered:\n- /api/auth\n- /api/doubts`);
});