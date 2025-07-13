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
        INSERT INTO regression_runs (project_id, execution_date, total_tests, passed, failed, unknown, run_name)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [projectId, runDate, 0, 0, 0, 0, regressionName]
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
    const process = spawn("python3", [
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
      return res.status(200).json({
	message: "Regression run started successfully",
	runId: newId,
      });
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

router.post("/json", async (req, res) => {
  const {
    runId,
    numOfTotal,
    numOfFailed,
    numOfPassed,
    numOfUnknown,
    parsedLogs,
  } = req.body;
  const [result] = await db.query(
    `
      UPDATE regression_runs SET total_tests = ?, passed = ?, failed = ?, unknown = ? WHERE run_id = ?
    `,
    [numOfTotal, numOfPassed, numOfFailed, numOfUnknown, runId]
  );

  for (const log of parsedLogs) {
    const { test_name, test_command, owner, component, status, summary } = log;
    const [result] = await db.query(
      `INSERT INTO test_cases (run_id, test_name, test_command, owner_id, component_id, status)
      SELECT ?, ?, ?, up.user_id, c.component_id, ?
      FROM components c
      JOIN modules m ON c.module_id = m.module_id
      JOIN user_project up ON up.project_id = m.project_id
      JOIN users u ON u.user_id = up.user_id
      WHERE c.component_name = ? AND u.name = ?`,
      [runId, test_name, test_command, status, component, owner]
    );

    const test_id = result.insertId;
    const { identified_errors } = summary;
    for (const identified_error of identified_errors) {
      const [result] = await db.query(
        `INSERT INTO errors (test_id, error_message) VALUES (?, ?)`,
        [test_id, identified_error]
      );
    }
  }

  res.status(200).json({ message: "Regression run updated successfully" });
});

module.exports = router;
