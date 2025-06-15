const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../config/database.cjs");
const { verifyToken } = require("../middleware/auth.cjs");

router.get("/:moduleId", verifyToken, async (req, res) => {
  const { regressionId, moduleId } = req.params;
  try {
    const [module] = await db.query(
      ` 
        select 
        m.module_name, 
        count(distinct c.component_id) as ComponentCount,
        (
            select max(rr2.execution_date)
            from test_cases tc2
            join components c2 on tc2.component_id = c2.component_id
            join regression_runs rr2 on rr2.run_id = tc2.run_id
            where c2.module_id = m.module_id
        ) as LastRegDate,
        SUM(CASE WHEN tc.status = 'PASS' THEN 1 ELSE 0 END) AS passed,
		SUM(CASE WHEN tc.status = 'FAIL' THEN 1 ELSE 0 END) AS failed,
		SUM(CASE WHEN tc.status = 'UNKNOWN' THEN 1 ELSE 0 END) AS unknown
        from modules m
        join components c on c.module_id = m.module_id
        join test_cases tc on tc.component_id = c.component_id
        join regression_runs rr on rr.run_id = tc.run_id
        where rr.run_id = ? and m.module_id = ?
        group by m.module_name
        `,
      [regressionId, moduleId]
    );
    res.json(module[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch module" });
  }
});

router.get("/:moduleId/contribution", verifyToken, async (req, res) => {
  const { regressionId, moduleId } = req.params;
  try {
    const [results] = await db.query(
      ` 
        select u.name as UserName, count(tc.owner_id) as ComponentCount
        from users u
        join test_cases tc on tc.owner_id = u.user_id
        join regression_runs rr on rr.run_id = tc.run_id
        join components c on tc.component_id = c.component_id
        join modules m on m.module_id = c.module_id
        where rr.run_id = ? and m.module_id = ?
        group by u.name
        `,
      [regressionId, moduleId]
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch module" });
  }
});

router.get("/:moduleId/errors", verifyToken, async (req, res) => {
  const { regressionId, moduleId } = req.params;
  try {
    const [result] = await db.query(
      `
          select tc.test_name, m.module_name, tc.status from test_cases as tc
          join components as c on tc.component_id = c.component_id
          join modules as m on m.module_id = c.module_id
          where tc.run_id = ? and m.module_id = ? and (tc.status = 'FAIL' or tc.status = 'UNKNOWN')
          `,
      [regressionId, moduleId]
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch module errors" });
  }
});

router.get("/:moduleId/components", verifyToken, async (req, res) => {
  const { regressionId, moduleId } = req.params;
  try {
    const [result] = await db.query(
      `
          SELECT 
          c.component_id,
          c.component_name,
          u.name,
          (
            SELECT MAX(rr2.execution_date)
            FROM test_cases tc2
            JOIN components c2 ON c2.component_id = tc2.component_id
            JOIN regression_runs rr2 ON rr2.run_id = tc2.run_id
            JOIN modules m2 ON c2.module_id = m2.module_id
            WHERE tc2.component_id = c.component_id
          ) AS LastRegressionDate
        FROM components c
        JOIN test_cases tc ON c.component_id = tc.component_id
        JOIN modules m ON m.module_id = c.module_id
        JOIN regression_runs rr ON rr.run_id = tc.run_id
        JOIN users u ON u.user_id = tc.owner_id
        WHERE rr.run_id = ? and m.module_id = ?
      `,
      [regressionId, moduleId]
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch regression modules" });
  }
});

module.exports = router;
