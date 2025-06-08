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
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Delete existing refresh tokens for this user
    await db.query('DELETE FROM refresh_tokens WHERE user_id = ?', [user.user_id]);

    // Create tokens
    const accessToken = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign({ user_id: user.user_id }, JWT_SECRET, { expiresIn: '7d' });

    // Store refresh token
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)',
      [user.user_id, refreshToken]
    );

    // Set cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Get assigned projects
    const [projectRows] = await db.query(`
      SELECT p.project_id, p.project_name
      FROM projects p
      JOIN user_project up ON p.project_id = up.project_id
      WHERE up.user_id = ?
    `, [user.user_id]);

    // Send response
    res.json({
      accessToken,
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        projects: projectRows
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Refresh token route
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    const [tokens] = await db.query(
      'SELECT * FROM refresh_tokens WHERE user_id = ? AND token = ?',
      [decoded.user_id, refreshToken]
    );

    if (tokens.length === 0) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const [users] = await db.query('SELECT * FROM users WHERE user_id = ?', [decoded.user_id]);
    const user = users[0];

    if (!user) {
      await db.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
      return res.status(401).json({ message: 'User not found' });
    }

    const accessToken = jwt.sign(
      {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Get assigned projects
    const [projectRows] = await db.query(`
      SELECT p.project_id, p.project_name
      FROM projects p
      JOIN user_project up ON p.project_id = up.project_id
      WHERE up.user_id = ?
    `, [user.user_id]);

    res.json({
      accessToken,
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        projects: projectRows
      }
    });
  } catch (error) {
    console.log("error: ", error);
    if (refreshToken) {
      await db.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
    }
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await db.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
  }

  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
