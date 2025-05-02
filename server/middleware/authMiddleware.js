const authenticateUser = (req, res, next) => {
  if (req.method === 'GET') {
    return next(); // No auth check for GET
  }

  const { userName, usn, role } = req.body;

  if (!userName || !usn || !role) {
    return res.status(401).json({ message: 'Unauthorized: Missing user info in body' });
  }

  // Attach the user info to req.user so routes can access it
  req.user = { userName, usn, role };
  
  next();
};

module.exports = authenticateUser;
