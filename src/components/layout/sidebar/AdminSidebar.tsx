import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import authService from "../../../services/auth";
import { useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <aside className={`${styles.root} ${isCollapsed ? styles.collapsed : ""}`}>
      <div className={styles.header}>
        <i className="logo" onClick={toggleSidebar} />
        <span className={styles.logoText}>&nbsp;&nbsp;&nbsp;RM Portal</span>
      </div>
      <div className={styles.main}>
        <nav>
          <ul>
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? `${styles.active}` : `${styles.inactive}`
                }
              >
                &nbsp;
                <i className="dashboardIcon" />
                &nbsp;Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  isActive ? `${styles.active}` : `${styles.inactive}`
                }
              >
                &nbsp;
                <i className="projectsIcon" />
                &nbsp;Projects
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  isActive ? `${styles.active}` : `${styles.inactive}`
                }
              >
                &nbsp;
                <i className="usersIcon" />
                &nbsp;Users
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <section />
      <div className={styles.main}>
        <NavLink
          to="/settings"
          end
          className={({ isActive }) =>
            isActive ? `${styles.active}` : `${styles.inactive}`
          }
        >
          &nbsp;
          <i className="settingsIcon" />
          &nbsp; Settings
        </NavLink>
        <button onClick={handleLogout} className={styles["logout-button"]}>
          <i className="logoutIcon" />
          &nbsp;Logout
        </button>
        <br />
        <span className={styles.user}>
          {authService.getUser()?.name || "User"}
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;
