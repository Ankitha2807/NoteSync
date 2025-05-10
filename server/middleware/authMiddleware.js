// server/middleware/authMiddleware.js
const authenticateUser = (req, res, next) => {
  // Allow GET requests without authentication
  if (req.method === 'GET') {
    return next();
  }

  // Extract user info from request body
  const { userName, usn, role } = req.body;

  // For debugging - log the request body
  console.log('Auth middleware received body:', req.body);

  if (!userName || !usn || !role) {
    console.log('Auth middleware: Missing user information');
    return res.status(401).json({ 
      message: 'Unauthorized: Missing user info in body',
      received: req.body 
    });
  }

  // Attach user info to req.user so routes can access it
  req.user = { userName, usn, role };
  console.log('Auth middleware: User authenticated', req.user);
  
  next();
};

module.exports = authenticateUser;