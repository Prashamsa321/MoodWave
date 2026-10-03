import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "retro-react";

export default function ReportFileMenu({ reports, activeId, onSelect }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <nav className="win98-report-menubar" aria-label="Reports menu">
      <button
        type="button"
        className="win98-menubar-button"
        onClick={() => navigate("/home")}
      >
        Home
      </button>

      <div className="win98-file-menu" ref={menuRef}>
        <Button
          className={`win98-file-trigger ${open ? "is-open" : ""}`}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          sx={{
            minWidth: 0,
            minHeight: 0,
            padding: "2px 8px",
            border: open ? "1px solid #808080" : "1px solid transparent",
            boxShadow: "none",
            background: open ? "#000080" : "transparent",
            color: open ? "#ffffff" : "#000000",
            fontSize: "12px",
            lineHeight: "18px",
          }}
        >
          <span className="win98-menu-access-key">F</span>ile
        </Button>

        {open && (
          <div className="win98-file-dropdown" role="menu" aria-label="Report files">
            {reports.map((report) => (
              <button
                key={report.id}
                type="button"
                role="menuitemradio"
                aria-checked={activeId === report.id}
                className={`win98-file-item ${
                  activeId === report.id ? "is-active" : ""
                }`}
                onClick={() => {
                  onSelect(report.id);
                  setOpen(false);
                }}
              >
                <span className="win98-file-item-icon" aria-hidden="true" />
                <span>{report.menuLabel}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
