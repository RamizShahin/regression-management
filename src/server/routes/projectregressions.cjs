const express = require("express");
const router = express.Router();
const db = require("../config/database.cjs");
const { verifyToken } = require("../middleware/auth.cjs");

router.get("/project/:projectId", verifyToken, async (req, res) => {
  const { projectId } = req.params;
  const connection = await db.getConnection();
  try {
    const [regressions] = await connection.query(
      "SELECT * FROM regression_runs WHERE project_id = ?",
      [projectId]
    );
    res.json(regressions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch regressions" });
  } finally {
    connection.release();
  }
});

router.get("/project/:projectId/team", verifyToken, async (req, res) => {
  const { projectId } = req.params;
  const connection = await db.getConnection();
  try {
    const [users] = await connection.query(
      "SELECT u.name, u.email, up.role FROM users AS u JOIN user_project AS up ON up.user_id = u.user_id WHERE project_id = ?",
      [projectId]
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch team members" });
  } finally {
    connection.release();
  }
});

module.exports = router;
