const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../config/database.cjs");
const { verifyToken } = require("../middleware/auth.cjs");

// Add new project route (admin/manager only)
router.post("/add", verifyToken, async (req, res) => {
  const connection = await db.getConnection();
  try {
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { name, description, modules } = req.body;

    const [existingProjects] = await connection.query(
      "SELECT * FROM projects WHERE project_name = ?",
      [name]
    );
    if (existingProjects.length > 0) {
      return res.status(400).json({ message: "Project already exists" });
    }

    await connection.query("START TRANSACTION");

    const [projectResult] = await connection.query(
      "INSERT INTO projects (project_name, project_description) VALUES (?, ?)",
      [name, description]
    );
    const projectId = projectResult.insertId;

    if (modules && Array.isArray(modules)) {
      for (const module of modules) {
        const [moduleResult] = await connection.query(
          "INSERT INTO modules (project_id, module_name, module_description) VALUES (?, ?, ?)",
          [projectId, module.name, module.description]
        );
        const moduleId = moduleResult.insertId;

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

// Get all projects (role-based)
router.get("/", verifyToken, async (req, res) => {
  try {
    const role = req.user?.role;
    const userId = req.user?.user_id;

    let projects;

    if (role === "admin" || role === "manager") {
      const [rows] = await db.query("SELECT * FROM projects");
      projects = rows;
    } else if (role === "user") {
      const [rows] = await db.query(`
        SELECT p.project_id, p.project_name, p.project_description
        FROM projects p
        JOIN user_project up ON p.project_id = up.project_id
        WHERE up.user_id = ?
      `, [userId]);
      projects = rows;
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT project_id, project_name, project_description FROM projects WHERE project_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
