const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../config/database.cjs");
const { verifyToken } = require("../middleware/auth.cjs");

// Add new user route (admin or manager)
router.post("/add", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { fullName, email, password, phone, role, projects } = req.body;

    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query("START TRANSACTION");

    const [result] = await db.query(
      "INSERT INTO users (email, phone, name, password, role) VALUES (?, ?, ?, ?, ?)",
      [email, phone, fullName, hashedPassword, role || "user"]
    );

    const userId = result.insertId;

    if (projects && Array.isArray(projects) && projects.length > 0) {
      const projectValues = projects.map((projectId) => [
        userId,
        projectId,
        role,
      ]);
      await db.query(
        "INSERT INTO user_project (user_id, project_id, role) VALUES ?",
        [projectValues]
      );
    }

    await db.query("COMMIT");

    res.status(201).json({
      message: "User created successfully",
      user_id: userId,
    });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users (admin or manager only)
router.get("/", verifyToken, async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "manager") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const [users] = await db.query("SELECT * FROM users");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user (admin or manager only)
router.delete("/:id", verifyToken, async (req, res) => {
  const userIdToDelete = req.params.id;

  if (req.user.role !== "admin" && req.user.role !== "manager") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const [result] = await db.query("DELETE FROM users WHERE user_id = ?", [
      userIdToDelete,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
