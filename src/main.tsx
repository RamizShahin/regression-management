import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import "./index.css";
import LoginPage from "./pages/login-page/LoginPage.tsx";
import authService from "./services/auth";
import Unauthorized from "./pages/unauthorized/UnAuthorized.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import Users from "./pages/users/users.tsx";
import Projects from "./pages/projects/Projects.tsx";
import Layout from "./components/Layout.tsx";
import "./assets/colors.css";
import Settings from "./pages/settings/Settings.tsx";
import AddUser from "./pages/add-user/AddUser.tsx";

// Modify LoginRedirect to use initializeAuth
const LoginRedirect = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await authService.initializeAuth();
      if (isAuthenticated) {
        // User is logged in, redirect to home or previous location
        navigate("/", { replace: true });
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [location, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If we get here, user is not authenticated
  return <LoginPage />;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginRedirect />,
  },

  { path: "/unauthorized", element: <Unauthorized /> },

  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute
            element={<Dashboard />}
            allowedRoles={["admin", "manager", "user"]}
          />
        ),
      },
      {
        path: "/users",
        element: (
          <ProtectedRoute
            element={<Users />}
            allowedRoles={["admin", "manager"]}
          />
        ),
      },
      {
        path: "/users/add",
        element: (
          <ProtectedRoute element={<AddUser />} allowedRoles={["admin"]} />
        ),
      },
      {
        path: "/projects",
        element: (
          <ProtectedRoute
            element={<Projects />}
            allowedRoles={["admin", "manager"]}
          />
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute
            element={<Settings />}
            allowedRoles={["admin", "manager", "user"]}
          />
        ),
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
