const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../config/database.cjs");
const fs = require("fs").promises;
const path = require("path");
const { verifyToken } = require("../middleware/auth.cjs");

router.get("/:componentId", verifyToken, async (req, res) => {
  const { regressionId, moduleId, componentId } = req.params;
  try {
    const [component] = await db.query(
      ` 
        select tc.test_name, c.component_name, rr.execution_date, u.name, tc.status
        from test_cases tc
        join components c on c.component_id = tc.component_id
        join regression_runs rr on rr.run_id = tc.run_id
        join users u on u.user_id = tc.owner_id
        where rr.run_id = ? and c.component_id = ?
        `,
      [regressionId, componentId]
    );
    res.json(component[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch component regression" });
  }
});

router.get("/:componentId/errors", verifyToken, async (req, res) => {
  const { regressionId, moduleId, componentId } = req.params;
  try {
    const [errors] = await db.query(
      ` 
        select error_message
        from errors e
        join test_cases tc on tc.test_id = e.test_id
        join components c on c.component_id = tc.component_id
        join regression_runs rr on rr.run_id = tc.run_id
        where rr.run_id = ? and c.component_id = ?
        `,
      [regressionId, componentId]
    );
    res.json(errors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch component errors" });
  }
});

router.get("/:componentId/history", verifyToken, async (req, res) => {
  const { regressionId, moduleId, componentId } = req.params;
  try {
    const [history] = await db.query(
      ` 
            select tc.test_name, rr.execution_date, u.name, tc.status
            from test_cases tc
            join components c on c.component_id = tc.component_id
            join regression_runs rr on rr.run_id = tc.run_id
            join users u on tc.owner_id = u.user_id
            where c.component_id = ?
          `,
      [componentId]
    );
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch component history" });
  }
});

router.get("/:componentId/logs", verifyToken, async (req, res) => {
  const { regressionId, moduleId, componentId } = req.params;
  const { name: componentName } = req.query;

  if (!componentName) {
    return res.status(400).json({ error: "Missing component name" });
  }

  try {
    const component = decodeURIComponent(componentName);

    const logPath = path.join(
      __dirname,
      "..",
      "uploads",
      `${regressionId}`,
      `${component}.txt`
    );

    const fileContent = await fs.readFile(logPath, "utf-8");

    res.send(fileContent);
  } catch (error) {
    console.error("Log file error:", error.message);
    res.status(500).json({ error: "Failed to read log file" });
  }
});

module.exports = router;
