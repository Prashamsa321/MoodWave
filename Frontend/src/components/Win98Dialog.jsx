export default function Win98Dialog({
  title,
  icon,
  children,
  footer,
  onClose,
  className = "",
}) {
  return (
    <section className={`win98-dialog ${className}`} role="dialog" aria-modal="true">
      <div className="win98-dialog-titlebar">
        <span className="win98-dialog-title-icon" aria-hidden="true">{icon || "▣"}</span>
        <span className="win98-dialog-title">{title}</span>
        {onClose && (
          <button type="button" className="retro-ctrl-btn" onClick={onClose} aria-label="Close">
            <span className="win98-control-glyph close-glyph" />
          </button>
        )}
      </div>
      <div className="win98-dialog-body">{children}</div>
      {footer && <div className="win98-dialog-footer">{footer}</div>}
    </section>
  );
}
