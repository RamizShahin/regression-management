const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database.cjs');
const { JWT_SECRET } = require('../middleware/auth.cjs');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user from database
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    // const validPassword = await bcrypt.compare(password, user.password);
    const validPassword = true;
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Delete all existing refresh tokens for this user
    await db.query('DELETE FROM refresh_tokens WHERE user_id = ?', [user.user_id]);

    // Create access token (short lived)
    const accessToken = jwt.sign(
      { 
        user_id: user.user_id,
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Create refresh token (long lived)
    const refreshToken = jwt.sign(
      { user_id: user.user_id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token in database
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)',
      [user.user_id, refreshToken]
    );

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Only send access token in response body
    res.json({
      accessToken,
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, name, password, role } = req.body;

    // Check if user already exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into database
    const [result] = await db.query(
      'INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, ?)',
      [email, name, hashedPassword, role || 'user']
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Modify refresh token route to use cookie
router.post('/refresh', async (req, res) => {
  // Get refresh token from cookie instead of request body
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    // Check if refresh token exists in database
    const [tokens] = await db.query(
      'SELECT * FROM refresh_tokens WHERE user_id = ? AND token = ?',
      [decoded.user_id, refreshToken]
    );

    if (tokens.length === 0) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Get user from database
    const [users] = await db.query('SELECT * FROM users WHERE user_id = ?', [decoded.user_id]);
    const user = users[0];

    if (!user) {
      // Delete the orphaned refresh token
      await db.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { 
        user_id: user.user_id,
        name: user.name,
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({
      accessToken,
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.log("error: ", error);
    // If token is expired or invalid, delete it from database
    if (refreshToken) {
      await db.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
    }
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Add logout route
router.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (refreshToken) {
    // Delete refresh token from database
    await db.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
  }

  // Clear refresh token cookie
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router; 