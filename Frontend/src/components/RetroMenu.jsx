import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginRequiredModal from "./LoginRequiredModal";

const PUBLIC_MENU = [
  {
    id: "home",
    label: "HOME",
    emoji: "🏠",
    path: "/home",
    color: "bg-pink-300",
    protected: false,
  },
  {
    id: "about",
    label: "ABOUT",
    emoji: "📖",
    path: "/about",
    color: "bg-yellow-200",
    protected: false,
  },
  {
    id: "findings",
    label: "DASHBOARD",
    emoji: "📊",
    path: "/findings",
    color: "bg-teal-200",
    protected: true,
  },
  {
    id: "models",
    label: "MODELS",
    emoji: "🧠",
    path: "/models",
    color: "bg-purple-300",
    protected: true,
  },
];

export default function RetroMenu() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [blockedFeature, setBlockedFeature] = useState("");

  const handleClick = (e, item) => {
    if (item.protected && !isAuthenticated) {
      e.preventDefault();
      setBlockedFeature(item.label);
      setShowLoginModal(true);
      return;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav
        className="
          fixed z-30
          top-2 left-2 right-2
          md:top-6 md:left-6 md:right-auto md:bottom-auto
          flex flex-row md:flex-col
          gap-2 md:gap-3
          justify-center md:justify-start
          flex-wrap
        "
      >
        {PUBLIC_MENU.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={(e) => handleClick(e, item)}
            className={({ isActive }) =>
              `retro-menu-item ${item.color} ${
                isActive ? "retro-menu-item-active" : ""
              }`
            }
          >
            <span className="retro-menu-emoji">{item.emoji}</span>
            <span className="retro-menu-label">{item.label}</span>
          </NavLink>
        ))}

        {/* Divider + account section */}
        {isAuthenticated ? (
          <>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `retro-menu-item bg-green-200 ${
                  isActive ? "retro-menu-item-active" : ""
                }`
              }
            >
              <span className="retro-menu-emoji">👤</span>
              <span className="retro-menu-label">MY PROFILE</span>
            </NavLink>

            <button
              onClick={handleLogout}
              className="retro-menu-item bg-red-200"
              title="Logout"
            >
              <span className="retro-menu-emoji">🚪</span>
              <span className="retro-menu-label">LOGOUT</span>
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `retro-menu-item bg-blue-200 ${
                isActive ? "retro-menu-item-active" : ""
              }`
            }
          >
            <span className="retro-menu-emoji">🔑</span>
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