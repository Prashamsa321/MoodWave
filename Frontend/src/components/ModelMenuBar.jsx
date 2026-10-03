import { useNavigate } from "react-router-dom";

export default function ModelMenuBar({ models, activeId, onSelect }) {
  const navigate = useNavigate();

  return (
    <nav className="win98-model-menubar" aria-label="Models">
      <button
        type="button"
        className="win98-model-menu-item win98-home-menu-item"
        onClick={() => navigate("/home")}
      >
        Home
      </button>

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
