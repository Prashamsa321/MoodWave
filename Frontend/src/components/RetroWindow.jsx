import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WINDOW_STATE_EVENT = "moodwave:window-state";
const WINDOW_COMMAND_EVENT = "moodwave:window-command";

export default function RetroWindow({
  title,
  children,
  menuBar,
  statusText = "Ready",
  appIcon = "▣",
  windowId,
  windowClassName = "",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const id = useMemo(
    () => windowId || location.pathname || title,
    [windowId, location.pathname, title],
  );

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(WINDOW_STATE_EVENT, {
        detail: { id, title, minimized, maximized },
      }),
    );
  }, [id, title, minimized, maximized]);

  useEffect(() => {
    const onWindowCommand = (event) => {
      const detail = event.detail || {};
      if (detail.id !== id) return;

      switch (detail.command) {
        case "minimize":
          setMinimized(true);
          break;
        case "restore":
          setMinimized(false);
          break;
        case "toggle-minimize":
          setMinimized((value) => !value);
          break;
        case "maximize":
          setMinimized(false);
          setMaximized(true);
          break;
        case "restore-size":
          setMinimized(false);
          setMaximized(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener(WINDOW_COMMAND_EVENT, onWindowCommand);
    return () => window.removeEventListener(WINDOW_COMMAND_EVENT, onWindowCommand);
  }, [id]);

  const handleClose = () => navigate("/");

  // Classic Windows behaviour: a minimized application disappears from the
  // desktop and remains available through its taskbar button.
  if (minimized) return null;

  return (
    <section
      className={`retro-window ${maximized ? "retro-window-maximized" : ""} ${windowClassName}`.trim()}
      data-window-id={id}
    >
      <div
        className="retro-window-titlebar"
        onDoubleClick={() => setMaximized((value) => !value)}
      >
        <span className="retro-window-app-icon" aria-hidden="true">
          {appIcon}
        </span>
        <span className="retro-window-title">{title}</span>

        <div className="retro-window-controls">
          <button
            type="button"
            className="retro-ctrl-btn"
            aria-label="Minimize"
            title="Minimize"
            onClick={(event) => {
              event.stopPropagation();
              setMinimized(true);
            }}
          >
            <span className="win98-control-glyph minimize-glyph" />
          </button>
          <button
            type="button"
            className="retro-ctrl-btn"
            aria-label={maximized ? "Restore" : "Maximize"}
            title={maximized ? "Restore" : "Maximize"}
            onClick={(event) => {
              event.stopPropagation();
              setMaximized((value) => !value);
            }}
          >
            <span
              className={`win98-control-glyph ${
                maximized ? "restore-glyph" : "maximize-glyph"
              }`}
            />
          </button>
          <button
            type="button"
            className="retro-ctrl-btn"
            aria-label="Close"
            title="Close"
            onClick={(event) => {
              event.stopPropagation();
              handleClose();
            }}
          >
            <span className="win98-control-glyph close-glyph" />
          </button>
        </div>
      </div>

      <div className="retro-menubar">
        {menuBar ?? (
          <>
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Help</span>
          </>
        )}
      </div>

      <div className="retro-window-content">{children}</div>

      <div className="retro-statusbar">
        <span className="retro-status-panel">{statusText}</span>
        <span className="retro-status-panel retro-status-grip" aria-hidden="true" />
      </div>
    </section>
  );
}
