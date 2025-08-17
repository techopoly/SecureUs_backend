const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register - Create new user account
router.post('/register', async (req, res) => {
//  console.log('Register request received:', req);
  const { username, email, password } = req.body;
    
  // Validation: Check if all fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username, email, and password are required' 
    });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide a valid email address' 
    });
  }

  // Password strength validation
  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 6 characters long' 
    });
  }

  try {
    // Check if email already exists
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Check if username already exists
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already taken' 
      });
    }

    // Create new user
    const userId = await User.createUser(username, email, password);
    
    res.status(201).json({ 
      success: true, 
      message: 'Account created successfully!', 
      userId 
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again.' 
    });
  }
});

// POST /api/auth/login - Authenticate user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }

  try {
    // Validate user credentials
    const user = await User.validateUser(email, password);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = User.generateToken(user);
    
    // Send success response with token and user info
    res.json({ 
      success: true, 
      message: 'Login successful!', 
      token, 
      user: { 
        id: user._id,
        username: user.username, 
        email: user.email 
      } 
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again.' 
    });
  }
});

// POST /api/auth/verify - Verify if token is still valid
router.post('/verify', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ 
      success: false, 
      message: 'Token is required' 
    });
  }

  const payload = User.verifyToken(token);
  if (!payload) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }

  res.json({ 
    success: true, 
    user: payload 
  });
});

module.exports = router;
