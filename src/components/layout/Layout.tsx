import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./sidebar/AdminSidebar";
import authService from "../../services/auth";

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const init = async () => {
      const success = await authService.initializeAuth();
      if (!success && location.pathname !== "/login") {
        navigate("/login");
      }
      setIsLoading(false);
    };
    init();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className={"main-content"}>
        <Outlet />
      </main>
    </div>
  );
}
