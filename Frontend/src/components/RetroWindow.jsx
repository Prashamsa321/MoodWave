import { useNavigate } from "react-router-dom";

export default function RetroWindow({ title, children }) {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="retro-window">
      {/* Title bar */}
      <div className="retro-window-titlebar">
        <div className="retro-window-dots">
          <span className="retro-dot retro-dot-red" />
          <span className="retro-dot retro-dot-yellow" />
          <span className="retro-dot retro-dot-green" />
        </div>
        <span className="retro-window-title">MOODWAVE — {title}</span>
        <div className="retro-window-controls">
          <button className="retro-ctrl-btn" aria-label="Minimize">
            ─
          </button>
          <button className="retro-ctrl-btn" aria-label="Maximize">
            □
          </button>
          <button
            className="retro-ctrl-btn retro-ctrl-close"
            aria-label="Close"
            onClick={handleClose}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Menu bar */}
      <div className="retro-menubar">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Go</span>
        <span>Favorites</span>
        <span>Help</span>
      </div>

      {/* Content */}
      <div className="retro-window-content">{children}</div>

      {/* Status bar */}
      <div className="retro-statusbar">
        <span>Ready</span>
        <span className="ml-auto">⏵ ⏸ ⏹</span>
      </div>
    </div>
  );
}