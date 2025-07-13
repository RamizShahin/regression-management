const express = require("express");
const router = express.Router();
const db = require("../config/database.cjs");
const { verifyToken } = require("../middleware/auth.cjs");

router.get("/:regressionId", verifyToken, async (req, res) => {
  const { regressionId } = req.params;
  try {
    const [regression] = await db.query(
      "SELECT * FROM regression_runs WHERE run_id = ?",
      [regressionId]
    );
    res.json(regression[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch regression" });
  }
});

router.get("/:regressionId/errors", verifyToken, async (req, res) => {
  const { regressionId } = req.params;
  try {
    const [result] = await db.query(
      `
        select tc.test_name, m.module_name, tc.status from test_cases as tc
        join components as c on tc.component_id = c.component_id
        join modules as m on m.module_id = c.module_id
        where tc.run_id = ? and (tc.status = 'FAIL' or tc.status = 'UNKNOWN')
        `,
      [regressionId]
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch regression errors" });
  }
});

router.get("/:regressionId/modules", verifyToken, async (req, res) => {
  const { regressionId } = req.params;
  try {
    const [result] = await db.query(
      `
        SELECT 
        m.module_id,
        m.module_name,
        COUNT(DISTINCT CASE WHEN rr1.run_id = ? THEN c.component_id END) AS ComponentCount,
        (
          SELECT MAX(rr2.execution_date)
          FROM test_cases tc2
          JOIN components c2 ON c2.component_id = tc2.component_id
          JOIN regression_runs rr2 ON rr2.run_id = tc2.run_id
          WHERE c2.module_id = m.module_id
        ) AS LastRegressionDate
      FROM modules m
      LEFT JOIN components c ON c.module_id = m.module_id
      LEFT JOIN test_cases tc ON tc.component_id = c.component_id
      LEFT JOIN regression_runs rr1 ON rr1.run_id = tc.run_id
      WHERE rr1.run_id = ?
      GROUP BY m.module_id, m.module_name

    `,
      [regressionId, regressionId]
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch regression modules" });
  }
});

module.exports = router;
