const express = require('express');
const router = express.Router();
const db = require('../config/database.cjs');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('../middleware/auth.cjs');

// POST /api/profile/info
router.post('/info', verifyToken, async (req, res) => {
    try {
      const { ...profileData } = req.body;
      const profileId = req.user.user_id;
  
      if (!profileId) {
        return res.status(400).json({ message: "Missing profileId" });
      }
  
      // Update the user's profile in your database
      const [result] = await db.query(
        'UPDATE users SET ? WHERE user_id = ?',
        [profileData, profileId]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.post('/password', verifyToken, async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const profileId = req.user.user_id;
  
      if (!profileId) {
        return res.status(400).json({ message: "Missing profileId" });
      }
  
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Missing password fields" });
      }
  
      // Fetch the user's current password from the database
      const [users] = await db.query('SELECT password FROM users WHERE user_id = ?', [profileId]);
      const user = users[0];
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Verify the old password
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
  
      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password in the database
      await db.query('UPDATE users SET password = ? WHERE user_id = ?', [hashedNewPassword, profileId]);
  
      res.status(200).json({ message: "Password changed successfully" });
  
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
module.exports = router;
