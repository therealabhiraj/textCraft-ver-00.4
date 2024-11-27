const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.models');
const authMiddleware = require('../middlewares/authMiddleware');  // Import the authMiddleware

const router = express.Router();

// Registration route (no auth required for registration)
router.post('/register',
    body('email').trim().isEmail().withMessage('Invalid email').isLength({ min: 13 }).withMessage('Email too short'),
    body('password').trim().isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
    body('username').trim().isLength({ min: 5 }).withMessage('Username must be at least 5 characters'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Invalid data'
        });
      }

      const { username, email, password } = req.body;
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          username,
          email,
          password: hashPassword
        });
        res.status(201).json(newUser);
      } catch (err) {
        res.status(500).json({ message: 'Server error' });
      }
    }
);

// Login route (no auth required for login)
router.post('/login',
  body('username').trim().isLength({ min: 5 }).withMessage('Username must be at least 5 characters'),
  body('password').trim().isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
  async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ message: 'Invalid username or password' });

      const isMatch = await bcrypt.compare(password.trim(), user.password.trim());
      if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

      const token = jwt.sign(
        { userId: user._id, email: user.email, username: user.username },
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );

      res.cookie('token', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', // Enable secure cookies in production
        maxAge: 3600 * 1000 // 1 hour expiration
      });

      res.status(200).json({
        message: 'Logged in successfully',
        token: token,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Protected route - example of a protected route that needs authentication
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); // req.user contains decoded user data from token
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Another protected route example (update user info, etc.)
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId, // Use user ID from the token
      { username, email },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout route (to clear the cookie)
router.post('/logout', (req, res) => {
  res.clearCookie('token'); // Clear the token cookie
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
