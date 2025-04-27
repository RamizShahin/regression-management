const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database.cjs');
const { verifyToken } = require('../middleware/auth.cjs');

// Add new user route (admin only)
router.post('/add', async (req, res) => {
  try {
    const { fullName, email, password, phone, role, projects } = req.body;
    console.log(req.body);

    // Check if user already exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Start a transaction
    await db.query('START TRANSACTION');

    // Insert user into database
    const [result] = await db.query(
      'INSERT INTO users (email, phone, name, password, role) VALUES (?, ?, ?, ?, ?)',
      [email, phone, fullName, hashedPassword, role || 'user']
    );
    
    const userId = result.insertId;

    // Assign projects if provided
    if (projects && Array.isArray(projects) && projects.length > 0) {
      const projectValues = projects.map(projectId => [userId, projectId, role]);
      await db.query(
        'INSERT INTO user_project (user_id, project_id, role) VALUES ?',
        [projectValues]
      );
    }

    // Commit transaction
    await db.query('COMMIT');

    res.status(201).json({ 
      message: 'User created successfully',
      user_id: userId
    });
  } catch (error) {
    // Rollback if error occurs
    await db.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (protected, only admin and manager can access)
router.get('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  
  try {
    // Get users from database
    const [users] = await db.query('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 