const User = require('../models/User');

// Middleware to protect routes - checks if user is authenticated
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Expected format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. Please login first.' 
    });
  }

  // Verify the token
  const payload = User.verifyToken(token);
  if (!payload) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token. Please login again.' 
    });
  }

  // Add user info to request object for use in route handlers
  req.user = payload;
  next(); // Continue to the next middleware/route handler
};

module.exports = authenticateToken;
// This middleware can be used in your routes to protect them