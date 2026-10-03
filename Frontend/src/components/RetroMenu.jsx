import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWindowManager } from "../context/WindowManagerContext";
import LoginRequiredModal from "./LoginRequiredModal";
import Win98Icon from "./Win98Icon";

const PUBLIC_MENU = [
  { id: "home", label: "HOME", icon: "computer", path: "/home", protected: false },
  { id: "about", label: "ABOUT", icon: "book", path: "/about", protected: false },
  { id: "findings", label: "REPORTS", icon: "report", path: "/findings", protected: true },
  { id: "models", label: "MODELS", icon: "models", path: "/models", protected: true },
];

export default function RetroMenu() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const windowManager = useWindowManager();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [blockedFeature, setBlockedFeature] = useState("");

  const handleClick = (e, item) => {
    if (item.protected && !isAuthenticated) {
      e.preventDefault();
      setBlockedFeature(item.label);
      setShowLoginModal(true);
    }
  };

  const handleLogout = () => {
    logout();
    if (windowManager?.closeAllWindows) {
      windowManager.closeAllWindows();
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <nav className="retro-desktop-icons" aria-label="MoodWave desktop shortcuts">
        {PUBLIC_MENU.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={(e) => handleClick(e, item)}
            className={({ isActive }) =>
              `retro-menu-item ${isActive ? "retro-menu-item-active" : ""}`
            }
          >
            <span className="retro-menu-icon-wrap">
              <Win98Icon type={item.icon} size={34} />
            </span>
            <span className="retro-menu-label">{item.label}</span>
          </NavLink>
        ))}

        {isAuthenticated ? (
          <>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `retro-menu-item ${isActive ? "retro-menu-item-active" : ""}`
              }
            >
              <span className="retro-menu-icon-wrap">
                <Win98Icon type="user" size={34} />
              </span>
              <span className="retro-menu-label">MY PROFILE</span>
            </NavLink>

            <button type="button" onClick={handleLogout} className="retro-menu-item" title="Log out">
              <span className="retro-menu-icon-wrap">
                <Win98Icon type="logout" size={34} />
              </span>
              <span className="retro-menu-label">LOGOUT</span>
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `retro-menu-item ${isActive ? "retro-menu-item-active" : ""}`
            }
          >
            <span className="retro-menu-icon-wrap">
              <Win98Icon type="key" size={34} />
            </span>
            <span className="retro-menu-label">SIGN IN</span>
          </NavLink>
        )}
      </nav>

      {showLoginModal && (
        <LoginRequiredModal
          featureName={blockedFeature}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </>
  );
}
