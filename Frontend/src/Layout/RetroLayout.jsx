import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import RetroMenu from "../components/RetroMenu";
import Win98Icon from "../components/Win98Icon";
import { useAuth } from "../context/AuthContext";
import { WindowManagerProvider } from "../context/WindowManagerContext";
import { WebPet } from "../components/web-pet";
import Home from "../Pages/Home";
import AboutUs from "../Pages/AboutUs";
import Findings from "../Pages/Findings";
import Models from "../Pages/Models";
import Profile from "../Pages/Profile";
import History from "../Pages/History";

const WINDOW_STATE_EVENT = "moodwave:window-state";
const WINDOW_COMMAND_EVENT = "moodwave:window-command";

const APP_DEFINITIONS = {
  "/home": {
    title: "MoodWave - Home",
    icon: "computer",
    Component: Home,
    protected: false,
  },
  "/about": {
    title: "About MoodWave",
    icon: "book",
    Component: AboutUs,
    protected: false,
  },
  "/findings": {
    title: "MoodWave Reports - Microsoft Word",
    icon: "report",
    Component: Findings,
    protected: true,
  },
  "/models": {
    title: "MoodWave Models",
    icon: "models",
    Component: Models,
    protected: true,
  },
  "/profile": {
    title: "User Properties",
    icon: "user",
    Component: Profile,
    protected: true,
  },
  "/history": {
    title: "Prediction History",
    icon: "history",
    Component: History,
    protected: true,
  },
};

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
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);

  const openDefinition = APP_DEFINITIONS[location.pathname] || null;

  const dispatchWindowCommand = useCallback((id, command) => {
    window.dispatchEvent(
      new CustomEvent(WINDOW_COMMAND_EVENT, {
        detail: { id, command },
      }),
    );
  }, []);

  const focusWindow = useCallback((id) => {
    setActiveWindowId(id);
    if (APP_DEFINITIONS[id]) {
      navigate(id, { replace: true });
    }
  }, [navigate]);

  const closeWindow = useCallback(
    (id) => {
      const remaining = openWindows.filter((item) => item.id !== id);
      setOpenWindows(remaining);

      const fallback =
        [...remaining].reverse().find((item) => !item.minimized) ||
        remaining[remaining.length - 1] ||
        null;

      setActiveWindowId(fallback?.id || null);
      navigate(fallback?.path || "/");
    },
    [navigate, openWindows],
  );


  const closeAllWindows = useCallback(() => {
    setOpenWindows([]);
    setActiveWindowId(null);
    navigate("/");
  }, [navigate]);

  const getCascadePosition = useCallback(
    (id) => {
      const index = Math.max(0, openWindows.findIndex((item) => item.id === id));
      const step = index % 6;
      return { x: step * 24, y: step * 18 };
    },
    [openWindows],
  );

  const windowManagerValue = useMemo(
    () => ({
      activeWindowId,
      focusWindow,
      closeWindow,
      closeAllWindows,
      getCascadePosition,
    }),
    [activeWindowId, closeAllWindows, closeWindow, focusWindow, getCascadePosition],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    setStartOpen(false);

    if (!openDefinition) return;

    if (openDefinition.protected && !isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    setOpenWindows((previous) => {
      const existing = previous.find((item) => item.id === location.pathname);
      if (existing) {
        return previous.map((item) =>
          item.id === location.pathname ? { ...item, minimized: false } : item,
        );
      }

      return [
        ...previous,
        {
          id: location.pathname,
          path: location.pathname,
          title: openDefinition.title,
          icon: openDefinition.icon,
          minimized: false,
          maximized: false,
        },
      ];
    });

    setActiveWindowId(location.pathname);
    window.setTimeout(() => dispatchWindowCommand(location.pathname, "restore"), 0);
  }, [
    dispatchWindowCommand,
    isAuthenticated,
    location.pathname,
    navigate,
    openDefinition,
  ]);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(formatClock()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onWindowState = (event) => {
      const detail = event.detail || {};
      if (!detail.id) return;

      setOpenWindows((previous) =>
        previous.map((item) =>
          item.id === detail.id ? { ...item, ...detail } : item,
        ),
      );

      if (detail.minimized) {
        setActiveWindowId((current) => (current === detail.id ? null : current));
      }
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

  const handleTaskButton = (windowItem) => {
    if (windowItem.minimized) {
      dispatchWindowCommand(windowItem.id, "restore");
      focusWindow(windowItem.id);
      return;
    }

    if (activeWindowId === windowItem.id) {
      dispatchWindowCommand(windowItem.id, "minimize");
      const fallback = [...openWindows]
        .reverse()
        .find((item) => item.id !== windowItem.id && !item.minimized);
      if (fallback) {
        focusWindow(fallback.id);
      } else {
        setActiveWindowId(null);
        navigate("/");
      }
      return;
    }

    focusWindow(windowItem.id);
  };

  const openPath = (path, requiresAuth = false) => {
    setStartOpen(false);
    if (requiresAuth && !isAuthenticated) {
      navigate("/login");
      return;
    }

    const existing = openWindows.find((item) => item.id === path);
    if (existing) {
      dispatchWindowCommand(path, "restore");
      focusWindow(path);
    }
    navigate(path);
  };

  const showDesktop = () => {
    setStartOpen(false);
    openWindows.forEach((item) => dispatchWindowCommand(item.id, "minimize"));
    setActiveWindowId(null);
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    setStartOpen(false);
    closeAllWindows();
  };

  return (
    <WindowManagerProvider value={windowManagerValue}>
      <div className="min-h-screen w-full relative retro-bg retro-desktop-shell">
        <RetroMenu />

        <main className="retro-desktop-main">
          <Outlet />
          {openWindows.map((windowItem) => {
            const definition = APP_DEFINITIONS[windowItem.path];
            if (!definition) return null;
            const AppComponent = definition.Component;
            return <AppComponent key={windowItem.id} />;
          })}
        </main>

        <WebPet
          animal="rat"
          color="brown"
          speed={6.9}
          scale={0.8}
          followMouse
          zIndex={140}
          mediaBaseUrl="https://webpets-flame.vercel.app/media"
          style={{ bottom: "30px" }}
        />

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
                  <StartItem icon="app" label="Show Desktop" onClick={showDesktop} />
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

          <div className="retro-task-window-list" aria-label="Open MoodWave applications">
            {openWindows.map((windowItem) => (
              <div
                key={windowItem.id}
                className={`retro-task-entry ${
                  windowItem.minimized
                    ? "is-minimized"
                    : activeWindowId === windowItem.id
                      ? "is-active"
                      : ""
                }`}
              >
                <button
                  type="button"
                  className="retro-task-button retro-task-main-button"
                  onClick={() => handleTaskButton(windowItem)}
                  title={windowItem.minimized ? `Restore ${windowItem.title}` : windowItem.title}
                >
                  <span className="win98-task-icon" aria-hidden="true">▣</span>
                  <span className="retro-task-title">{windowItem.title}</span>
                </button>
                <button
                  type="button"
                  className="retro-task-close-button"
                  aria-label={`Close ${windowItem.title}`}
                  title={`Close ${windowItem.title}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    closeWindow(windowItem.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <span className="ml-auto retro-taskbar-clock">{clock}</span>
        </div>
      </div>
    </WindowManagerProvider>
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
