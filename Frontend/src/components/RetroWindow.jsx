import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWindowManager } from "../context/WindowManagerContext";

const WINDOW_STATE_EVENT = "moodwave:window-state";
const WINDOW_COMMAND_EVENT = "moodwave:window-command";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const MIN_WINDOW_WIDTH = 360;
const MIN_WINDOW_HEIGHT = 260;
const RESIZE_DIRECTIONS = ["n", "e", "s", "w", "ne", "nw", "se", "sw"];

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
  const windowManager = useWindowManager();
  const windowRef = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [size, setSize] = useState({ width: null, height: null });

  const id = useMemo(
    () => windowId || location.pathname || title,
    [windowId, location.pathname, title],
  );
  const [position, setPosition] = useState(() =>
    windowManager?.getCascadePosition?.(id) || { x: 0, y: 0 },
  );
  const isActiveWindow = !windowManager || windowManager.activeWindowId === id;

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

  // Keep moved/resized windows reachable when the browser is resized or zoom
  // changes. If a manually-resized window no longer fits, shrink it to the
  // available desktop work area before correcting its position.
  useEffect(() => {
    const keepWindowInBounds = () => {
      if (maximized || minimized || !windowRef.current) return;

      const windowElement = windowRef.current;
      const desktop = windowElement.closest(".retro-desktop-main");
      if (!desktop) return;

      const rect = windowElement.getBoundingClientRect();
      const desktopRect = desktop.getBoundingClientRect();
      const maxWidth = Math.max(1, desktopRect.width);
      const maxHeight = Math.max(1, desktopRect.height);

      if (size.width !== null || size.height !== null) {
        const nextWidth = size.width === null ? null : Math.min(size.width, maxWidth);
        const nextHeight = size.height === null ? null : Math.min(size.height, maxHeight);

        if (nextWidth !== size.width || nextHeight !== size.height) {
          setSize({ width: nextWidth, height: nextHeight });
        }
      }

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

    keepWindowInBounds();
    window.addEventListener("resize", keepWindowInBounds);
    return () => window.removeEventListener("resize", keepWindowInBounds);
  }, [maximized, minimized, size.height, size.width]);

  const beginDrag = (event) => {
    focusThisWindow();
    if (maximized || minimized || resizing || event.button !== 0) return;
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

  const beginResize = (event, direction) => {
    focusThisWindow();
    if (maximized || minimized || event.button !== 0) return;

    const windowElement = windowRef.current;
    const desktop = windowElement?.closest(".retro-desktop-main");
    if (!windowElement || !desktop) return;

    const rect = windowElement.getBoundingClientRect();
    const desktopRect = desktop.getBoundingClientRect();

    resizeRef.current = {
      pointerId: event.pointerId,
      direction,
      startX: event.clientX,
      startY: event.clientY,
      rect,
      desktopRect,
      originX: position.x,
      originY: position.y,
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
    setResizing(true);
    event.stopPropagation();
    event.preventDefault();
  };

  const moveResize = (event) => {
    const resize = resizeRef.current;
    if (!resize || resize.pointerId !== event.pointerId) return;

    const { direction, rect, desktopRect } = resize;
    const dx = event.clientX - resize.startX;
    const dy = event.clientY - resize.startY;
    const minWidth = Math.min(MIN_WINDOW_WIDTH, desktopRect.width);
    const minHeight = Math.min(MIN_WINDOW_HEIGHT, desktopRect.height);

    let left = rect.left;
    let right = rect.right;
    let top = rect.top;
    let bottom = rect.bottom;

    if (direction.includes("e")) {
      right = clamp(rect.right + dx, rect.left + minWidth, desktopRect.right);
    }

    if (direction.includes("w")) {
      left = clamp(rect.left + dx, desktopRect.left, rect.right - minWidth);
    }

    if (direction.includes("s")) {
      bottom = clamp(rect.bottom + dy, rect.top + minHeight, desktopRect.bottom);
    }

    if (direction.includes("n")) {
      top = clamp(rect.top + dy, desktopRect.top, rect.bottom - minHeight);
    }

    const nextWidth = Math.round(right - left);
    const nextHeight = Math.round(bottom - top);

    setSize({
      width: nextWidth,
      height: nextHeight,
    });

    // Normal windows are horizontally centered with margin: 0 auto. Changing
    // their width therefore shifts their CSS base position by half the width
    // delta. Compensate for that shift so the opposite edge stays anchored
    // under the pointer, just like a real desktop window.
    const centeredWidthCompensation = (nextWidth - rect.width) / 2;

    setPosition({
      x: resize.originX + (left - rect.left) + centeredWidthCompensation,
      y: resize.originY + (top - rect.top),
    });
  };

  const endResize = (event) => {
    const resize = resizeRef.current;
    if (!resize || resize.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    resizeRef.current = null;
    setResizing(false);
  };

  const handleClose = () => {
    if (windowManager?.closeWindow) {
      windowManager.closeWindow(id);
      return;
    }
    navigate("/");
  };

  const focusThisWindow = () => {
    windowManager?.focusWindow?.(id);
  };

  // Classic Windows behaviour: a minimized application disappears from the
  // desktop and remains available through its taskbar button.
  if (minimized) return null;

  const windowStyle = {
    zIndex: isActiveWindow ? 85 : 30,
    ...(maximized
      ? {}
      : {
          transform: `translate3d(calc(-50% + ${position.x}px), ${position.y}px, 0)`,
          ...(size.width !== null ? { width: `${size.width}px`, maxWidth: "none" } : {}),
          ...(size.height !== null ? { height: `${size.height}px` } : {}),
        }),
  };

  return (
    <section
      ref={windowRef}
      className={`retro-window ${maximized ? "retro-window-maximized" : ""} ${dragging ? "is-dragging" : ""} ${resizing ? "is-resizing" : ""} ${isActiveWindow ? "is-active-window" : "is-inactive-window"} ${windowClassName}`.trim()}
      data-window-id={id}
      style={windowStyle}
      onPointerDownCapture={focusThisWindow}
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
              focusThisWindow();
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
              focusThisWindow();
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
            <button type="button" className="win98-menubar-button" onClick={() => navigate("/home")}>Home</button>
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
        <span
          className="retro-status-panel retro-status-grip"
          aria-hidden="true"
          onPointerDown={(event) => beginResize(event, "se")}
          onPointerMove={moveResize}
          onPointerUp={endResize}
          onPointerCancel={endResize}
        />
      </div>

      {!maximized &&
        RESIZE_DIRECTIONS.map((direction) => (
          <span
            key={direction}
            className={`retro-resize-handle retro-resize-${direction}`}
            aria-hidden="true"
            onPointerDown={(event) => beginResize(event, direction)}
            onPointerMove={moveResize}
            onPointerUp={endResize}
            onPointerCancel={endResize}
          />
        ))}
    </section>
  );
}
