//server/server.js
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
const pyqRoute = require('./routes/pyq');
const doubtRoute = require('./routes/doubt');

dotenv.config();

const app = express();

// ------------------ MIDDLEWARE SETUP ------------------ //
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Debug incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Body:`, req.body);
  next();
});

// ------------------ STATIC FILES ------------------ //
// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
const pyqUploadsDir = path.join(__dirname, '..', 'pyq-uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(pyqUploadsDir)) {
  fs.mkdirSync(pyqUploadsDir, { recursive: true });
}

// Serve static files from both upload folders
app.use('/uploads', express.static(uploadsDir));
app.use('/pyq-uploads', express.static(pyqUploadsDir));

// ------------------ ROUTE SETUP ------------------ //
app.use('/api/auth', authRoute);
app.use('/api/test', testRoute);
app.use('/api/documents', documentRoute);
app.use('/api/pyqs', pyqRoute);
app.use('/api/doubts', doubtRoute);

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
    process.exit(1);
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
  console.log('Routes registered:\n- /api/auth\n- /api/test\n- /api/documents\n- /api/pyqs\n- /api/doubts');
});