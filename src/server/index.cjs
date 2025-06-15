require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.cjs");
const usersRoutes = require("./routes/users.cjs");
const projectsRoutes = require("./routes/projects.cjs");
const profileRoutes = require("./routes/profile.cjs");
const addRegressionRoutes = require("./routes/addregression.cjs");
const projectRegressionsRoutes = require("./routes/projectregressions.cjs");
const regressionRoutes = require("./routes/regression.cjs");
const regressionModuleRoutes = require("./routes/regressionmodule.cjs");
const regressionComponentRoutes = require("./routes/regressioncomponent.cjs");
const { verifyToken } = require("./middleware/auth.cjs");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/upload-regression", addRegressionRoutes);
app.use("/api/regressions", projectRegressionsRoutes);
app.use("/api/regression", regressionRoutes);
app.use("/api/regression/:regressionId/module", regressionModuleRoutes);
app.use(
  "/api/regression/:regressionId/module/:moduleId/component",
  regressionComponentRoutes
);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
