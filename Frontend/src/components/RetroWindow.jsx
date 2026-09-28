import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WINDOW_STATE_EVENT = "moodwave:window-state";
const WINDOW_COMMAND_EVENT = "moodwave:window-command";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

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
  const windowRef = useRef(null);
  const dragRef = useRef(null);
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

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

  // Keep a moved window reachable when the browser is resized or zoom changes.
  useEffect(() => {
    const keepWindowInBounds = () => {
      if (maximized || minimized || !windowRef.current) return;

      const windowElement = windowRef.current;
      const desktop = windowElement.closest(".retro-desktop-main");
      if (!desktop) return;

      const rect = windowElement.getBoundingClientRect();
      const desktopRect = desktop.getBoundingClientRect();
      let dx = 0;
      let dy = 0;

      if (rect.left < desktopRect.left) dx = desktopRect.left - rect.left;
      if (rect.right > desktopRect.right) dx = desktopRect.right - rect.right;
      if (rect.top < desktopRect.top) dy = desktopRect.top - rect.top;
      if (rect.bottom > desktopRect.bottom) dy = desktopRect.bottom - rect.bottom;

      if (dx || dy) {
        setPosition((previous) => ({
          x: previous.x + dx,
          y: previous.y + dy,
        }));
      }
    };

    window.addEventListener("resize", keepWindowInBounds);
    return () => window.removeEventListener("resize", keepWindowInBounds);
  }, [maximized, minimized]);

  const beginDrag = (event) => {
    if (maximized || minimized || event.button !== 0) return;
    if (event.target.closest(".retro-window-controls")) return;

    const windowElement = windowRef.current;
    const desktop = windowElement?.closest(".retro-desktop-main");
    if (!windowElement || !desktop) return;

    const rect = windowElement.getBoundingClientRect();
    const desktopRect = desktop.getBoundingClientRect();

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      minDx: desktopRect.left - rect.left,
      maxDx: desktopRect.right - rect.right,
      minDy: desktopRect.top - rect.top,
      maxDy: desktopRect.bottom - rect.bottom,
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(true);
    event.preventDefault();
  };

  const moveDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = clamp(event.clientX - drag.startX, drag.minDx, drag.maxDx);
    const dy = clamp(event.clientY - drag.startY, drag.minDy, drag.maxDy);

    setPosition({
      x: drag.originX + dx,
      y: drag.originY + dy,
    });
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragRef.current = null;
    setDragging(false);
  };

  const handleClose = () => navigate("/");

  // Classic Windows behaviour: a minimized application disappears from the
  // desktop and remains available through its taskbar button.
  if (minimized) return null;

  return (
    <section
      ref={windowRef}
      className={`retro-window ${maximized ? "retro-window-maximized" : ""} ${dragging ? "is-dragging" : ""} ${windowClassName}`.trim()}
      data-window-id={id}
      style={maximized ? undefined : { transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      <div
        className="retro-window-titlebar"
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
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
