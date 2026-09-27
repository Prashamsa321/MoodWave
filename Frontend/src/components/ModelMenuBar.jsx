export default function ModelMenuBar({ models, activeId, onSelect }) {
  return (
    <nav className="win98-model-menubar" aria-label="Models">
      {models.map((model) => (
        <button
          key={model.id}
          type="button"
          className={`win98-model-menu-item ${
            activeId === model.id ? "is-active" : ""
          }`}
          onClick={() => onSelect(model.id)}
        >
          {model.menuLabel || model.name}
        </button>
      ))}
    </nav>
  );
}
