import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import RetroMenu from "../components/RetroMenu";
import Win98Icon from "../components/Win98Icon";
import { useAuth } from "../context/AuthContext";

const WINDOW_STATE_EVENT = "moodwave:window-state";
const WINDOW_COMMAND_EVENT = "moodwave:window-command";

function formatClock() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function RetroLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const startRef = useRef(null);
  const [clock, setClock] = useState(formatClock);
  const [startOpen, setStartOpen] = useState(false);
  const [windowState, setWindowState] = useState({
    id: location.pathname,
    title: getPageTitle(location.pathname),
    minimized: false,
    maximized: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setStartOpen(false);
    setWindowState({
      id: location.pathname,
      title: getPageTitle(location.pathname),
      minimized: false,
      maximized: false,
    });
  }, [location.pathname]);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(formatClock()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onWindowState = (event) => {
      const detail = event.detail || {};
      if (!detail.id) return;
      setWindowState((previous) => ({ ...previous, ...detail }));
    };

    window.addEventListener(WINDOW_STATE_EVENT, onWindowState);
    return () => window.removeEventListener(WINDOW_STATE_EVENT, onWindowState);
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (startRef.current && !startRef.current.contains(event.target)) {
        setStartOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const hasApplicationWindow = location.pathname !== "/";

  const handleTaskButton = () => {
    if (!hasApplicationWindow) return;
    window.dispatchEvent(
      new CustomEvent(WINDOW_COMMAND_EVENT, {
        detail: {
          id: windowState.id || location.pathname,
          command: "toggle-minimize",
        },
      }),
    );
  };

  const openPath = (path, requiresAuth = false) => {
    setStartOpen(false);
    if (requiresAuth && !isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setStartOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full relative retro-bg retro-desktop-shell">
      <RetroMenu />

      <main className="retro-desktop-main pt-32 md:pt-8 px-4 md:pl-40 md:pr-8 pb-20 max-w-6xl mx-auto md:mx-auto">
        <Outlet />
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-8 retro-taskbar z-[100] flex items-center px-2 text-xs">
        <div className="win98-start-area" ref={startRef}>
          {startOpen && (
            <div className="win98-start-menu" role="menu">
              <div className="win98-start-banner">MoodWave</div>
              <div className="win98-start-items">
                <StartItem icon="computer" label="Home" onClick={() => openPath("/home")} />
                <StartItem icon="book" label="About MoodWave" onClick={() => openPath("/about")} />
                <StartItem icon="report" label="Reports" onClick={() => openPath("/findings", true)} />
                <StartItem icon="models" label="Models" onClick={() => openPath("/models", true)} />
                <div className="win98-start-separator" />
                {isAuthenticated ? (
                  <>
                    <StartItem icon="user" label="My Profile" onClick={() => openPath("/profile")} />
                    <StartItem icon="history" label="Prediction History" onClick={() => openPath("/history")} />
                    <div className="win98-start-separator" />
                    <StartItem icon="logout" label="Log Off..." onClick={handleLogout} />
                  </>
                ) : (
                  <StartItem icon="key" label="Sign In..." onClick={() => openPath("/login")} />
                )}
                <StartItem icon="app" label="Show Desktop" onClick={() => openPath("/")} />
              </div>
            </div>
          )}

          <button
            type="button"
            className={`retro-start-btn px-3 py-1 mr-2 font-bold ${startOpen ? "is-open" : ""}`}
            onClick={() => setStartOpen((value) => !value)}
            aria-expanded={startOpen}
          >
            <span className="win98-start-logo" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            Start
          </button>
        </div>

        {hasApplicationWindow && (
          <button
            type="button"
            className={`retro-task-button ${
              windowState.minimized ? "is-minimized" : "is-active"
            }`}
            onClick={handleTaskButton}
            title={windowState.minimized ? "Restore window" : "Minimize window"}
          >
            <span className="win98-task-icon" aria-hidden="true">▣</span>
            {windowState.title || getPageTitle(location.pathname)}
          </button>
        )}

        <span className="ml-auto retro-taskbar-clock">{clock}</span>
      </div>
    </div>
  );
}

function StartItem({ icon, label, onClick }) {
  return (
    <button type="button" className="win98-start-item" onClick={onClick} role="menuitem">
      <Win98Icon type={icon} size={28} />
      <span>{label}</span>
    </button>
  );
}

function getPageTitle(path) {
  if (path === "/") return "Desktop";
  if (path.includes("findings")) return "MoodWave Reports - Microsoft Word";
  if (path.includes("models")) return "MoodWave Models";
  if (path.includes("about")) return "About MoodWave";
  if (path.includes("home")) return "MoodWave - Home";
  if (path.includes("profile")) return "User Properties";
  if (path.includes("history")) return "Prediction History";
  return "MoodWave";
}
