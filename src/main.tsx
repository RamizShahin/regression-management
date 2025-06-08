import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { StrictMode } from "react";

import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/layout/Layout";
import authService from "./services/auth";

import LoginPage from "./pages/login-page/LoginPage";
import Unauthorized from "./pages/unauthorized/UnAuthorized";
import Dashboard from "./pages/dashboard/Dashboard";
import Users from "./pages/users/users";
import AddUser from "./pages/users/AddUser";
import Projects from "./pages/projects/Projects";
import AddProject from "./pages/projects/AddProject";
import ProjectPortal from "./pages/projects/ProjectPortal";
import ProjectRegression from "./pages/projects/ProjectRegression";
import ProjectModule from "./pages/projects/ProjectModule";
import ProjectComponent from "./pages/projects/ProjectComponent";
import NewRegressionRun from "./pages/projects/new-regression/NewRegression";
import Settings from "./pages/settings/Settings";
import Parsers from "./pages/Parsers/Parsers"
import AddParsers from "./pages/Parsers/NewParser"

import "./index.css";
import "./assets/colors.css";

// Handles auth check and redirect logic
const LoginRedirect = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await authService.initializeAuth();
      if (isAuthenticated) {
        navigate("/", { replace: true });
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [location, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <LoginPage />;
};

// Main App entry with routes
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <ProtectedRoute
                element={<Dashboard />}
                allowedRoles={["admin", "manager", "user"]}
              />
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute
                element={<Users />}
                allowedRoles={["admin", "manager"]}
              />
            }
          />
          <Route
            path="users/add"
            element={
              <ProtectedRoute
                element={<AddUser />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="projects"
            element={
              <ProtectedRoute
                element={<Projects />}
                allowedRoles={["admin", "manager", "user"]}
              />
            }
          />
          <Route
            path="projects/add"
            element={
              <ProtectedRoute
                element={<AddProject />}
                allowedRoles={["admin", "manager", "user"]}
              />
            }
          />
          <Route
            path="projects/:id"
            element={
              <ProtectedRoute
                element={<ProjectPortal />}
                allowedRoles={["admin", "manager", "user"]}
              />
            }
          />
          <Route
            path="projects/:id/regression/:regressionId"
            element={
              <ProtectedRoute
                element={<ProjectRegression />}
                allowedRoles={["admin", "manager", "user"]}
              />
            }
          />
          <Route
            path="projects/:id/regression/:regressionId/module/:moduleId"
            element={
              <ProtectedRoute
                element={<ProjectModule />}
                allowedRoles={["admin", "manager", "user"]}
              />
            }
          />
          <Route
            path="projects/:id/regression/:regressionId/module/:moduleId/component/:componentId"
            element={
              <ProtectedRoute
                element={<ProjectComponent />}
                allowedRoles={["admin", "manager", "user"]}
              />
            }
          />
          <Route
            path="projects/:id/new-regression"
            element={
              <ProtectedRoute
                element={<NewRegressionRun />}
                allowedRoles={["admin", "manager", "user"]}
              />
            }
          />
          <Route
            path="parsers"
            element={
              <ProtectedRoute
                element={<Parsers />}
                allowedRoles={["admin", "manager", "user"]}
              />
            }
          />
           <Route
            path="parsers/add"
            element={
              <ProtectedRoute
                element={< AddParsers/>}
                allowedRoles={["admin", "manager", "user"]}
              />
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute
                element={<Settings />}
                allowedRoles={["admin", "manager", "user"]}
              />
            }
          />
        </Route>

        {/* fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
