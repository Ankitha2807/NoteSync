const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Import routes
const authRoute = require('./routes/auth');
const testRoute = require('./routes/test');
const documentRoute = require('./routes/document');
const doubtRoute = require('./routes/doubt'); // Ensure the path is correct

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

// ------------------ STATIC FILES ------------------ //
// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from the uploads folder
app.use('/uploads', express.static(uploadsDir));

// ------------------ ROUTE SETUP ------------------ //
app.use('/api/auth', authRoute);   // User login/register
app.use('/api/test', testRoute);  // Test endpoint
app.use('/api/documents', documentRoute); // Document management
app.use('/api/doubts', doubtRoute); // Ask/answer doubts

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
  console.log('Routes registered:\n- /api/auth\n- /api/test\n- /api/documents\n- /api/doubts');
});