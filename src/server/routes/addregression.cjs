// uploadRegression.ts
const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const db = require("../config/database.cjs");

const router = express.Router();

// Use multer for folder (multi-file) upload
const upload = multer({ dest: "uploads/" });

router.post("/", upload.array("logs"), async (req, res) => {
  try {
    const { projectId, plugin, runDate, regressionName } = req.body;
    const files = req.files;

    if (!projectId || !plugin || !runDate || !regressionName || !files.length) {
      return res
        .status(400)
        .json({ error: "Missing required fields or files" });
    }

    // Save metadata to DB
    const [result] = await db.query(
      `
        INSERT INTO regression_runs (project_id, execution_date, total_tests, passed, failed, unknown)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [projectId, runDate, 0, 0, 0, 0]
    );

    const newId = result.insertId;

    // Optional: Move files to a named folder
    const runFolder = path.join("uploads", String(newId));
    fs.mkdirSync(runFolder, { recursive: true });

    for (const file of files) {
      const dest = path.join(runFolder, file.originalname);
      fs.renameSync(file.path, dest);
    }

    // Trigger Python parser with folder + metadata
    const process = spawn("python", [
      "parser/main.py",
      "--plugin",
      "plugin2",
      "--folder",
      runFolder,
      "--run-id",
      newId,
    ]);

    process.stdout.on("data", (data) => {
      console.log(`PYTHON OUT: ${data}`);
    });

    // process.stderr.on("data", (data) => {
    //   console.error(`PYTHON ERR: ${data}`);
    // });

    // process.on("close", (code) => {
    //   if (code === 0) {
    //     return res.status(200).json({
    //       message: "Regression run started successfully",
    //       regressionRunId,
    //     });
    //   } else {
    //     return res.status(500).json({ error: "Parser failed to run" });
    //   }
    // });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/json", async (req, res) => {});

module.exports = router;
