const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../config/database.cjs");
const { verifyToken } = require("../middleware/auth.cjs");

// Add new user route (admin only)
router.post("/add", verifyToken, async (req, res) => {
  const connection = await db.getConnection(); // use a single connection if using transactions
  try {
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const { name, description, modules } = req.body;
    console.log(req.body);

    // Check if project already exists
    const [existingProjects] = await connection.query(
      "SELECT * FROM projects WHERE project_name = ?",
      [name]
    );
    if (existingProjects.length > 0) {
      return res.status(400).json({ message: "Project already exists" });
    }

    await connection.query("START TRANSACTION");

    // Insert project
    const [projectResult] = await connection.query(
      "INSERT INTO projects (project_name, project_description) VALUES (?, ?)",
      [name, description]
    );
    const projectId = projectResult.insertId;

    // Insert modules
    if (modules && Array.isArray(modules)) {
      for (const module of modules) {
        const [moduleResult] = await connection.query(
          "INSERT INTO modules (project_id, module_name, module_description) VALUES (?, ?, ?)",
          [projectId, module.name, module.description]
        );
        const moduleId = moduleResult.insertId;

        // Insert components if any
        if (module.components && Array.isArray(module.components)) {
          for (const component of module.components) {
            await connection.query(
              "INSERT INTO components (module_id, component_name, component_description) VALUES (?, ?, ?)",
              [moduleId, component.name, component.description]
            );
          }
        }
      }
    }

    await connection.query("COMMIT");

    res.status(201).json({
      message: "Project created successfully",
      project_id: projectId,
    });
  } catch (error) {
    await connection.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
});

// Get all projects (protected, only admin and manager can access)
router.get("/", verifyToken, async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "manager") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    // Get projects from database
    const [projects] = await db.query("SELECT * FROM projects");
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
