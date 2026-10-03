import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import RetroWindow from "../components/RetroWindow";
import Win98Icon from "../components/Win98Icon";
import api from "../services/api";

const MODEL_META = {
  mood: { label: "Mood Classifier" },
  genre: { label: "Genre Classifier" },
  popularity: { label: "Popularity Predictor" },
  cluster: { label: "Emotion Grouping" },
  pca: { label: "Emotion Map" },
  similar: { label: "Find Similar Songs" },
};

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/predictions");
        setPredictions(data.predictions || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () => filter === "all" ? predictions : predictions.filter((p) => p.modelType === filter),
    [filter, predictions],
  );

  const availableModels = useMemo(
    () => Object.entries(MODEL_META).filter(([key]) => predictions.some((p) => p.modelType === key)),
    [predictions],
  );

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const summarize = (pred) => {
    const out = pred.output || {};
    switch (pred.modelType) {
      case "mood":
        return out.mood
          ? `${out.mood} (${((out.probabilities?.[out.mood] || 0) * 100).toFixed(1)}%)`
          : "Mood predicted";
      case "genre":
        return out.top_genres?.[0]
          ? `${out.top_genres[0].genre} (${(out.top_genres[0].probability * 100).toFixed(1)}%)`
          : "Genre predicted";
      case "popularity":
        return `Score: ${out.popularity ?? "?"}/100`;
      case "cluster":
        return out.cluster_id !== undefined
          ? `Cluster ${out.cluster_id} — ${out.profile?.common_genres || ""}`
          : "Cluster predicted";
      case "pca":
        return `Position: (${(out.pca_1 ?? 0).toFixed(2)}, ${(out.pca_2 ?? 0).toFixed(2)})`;
      case "similar": {
        const count = Array.isArray(out.recommendations) ? out.recommendations.length : 0;
        const first = out.recommendations?.[0];
        if (!count) return "Similar-song search completed";
        if (first?.track_name) {
          return `${count} songs — first: ${first.track_name}`;
        }
        return `${count} songs recommended`;
      }
      default:
        return "Prediction saved";
    }
  };

  return (
    <RetroWindow windowId="/history" title="Prediction History" appIcon="H" statusText={`${filtered.length} item${filtered.length === 1 ? "" : "s"}`}>
      <div className="win98-app-page win98-history-page">
        <div className="win98-history-toolbar">
          <span>Show:</span>
          <select className="win98-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All models ({predictions.length})</option>
            {availableModels.map(([key, meta]) => (
              <option key={key} value={key}>{meta.label}</option>
            ))}
          </select>
          <span className="win98-toolbar-spacer" />
          <span>{predictions.length} saved prediction{predictions.length === 1 ? "" : "s"}</span>
        </div>

        {loading && (
          <div className="win98-message-box">
            <span className="win98-message-icon">i</span>
            <span>Loading prediction history...</span>
          </div>
        )}

        {error && (
          <div className="win98-message-box is-error">
            <span className="win98-message-icon">!</span>
            <span>Error: {error}</span>
          </div>
        )}

        {!loading && !error && predictions.length === 0 && (
          <div className="win98-history-empty">
            <Win98Icon type="history" size={48} />
            <p>No predictions have been saved yet.</p>
            <Link to="/models" className="retro-btn win98-default-button">Open Models...</Link>
          </div>
        )}

        {!loading && !error && predictions.length > 0 && (
          <div className="win98-listview-frame">
            <table className="win98-listview-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Result</th>
                  <th>Date modified</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((pred) => (
                  <tr key={pred._id}>
                    <td>
                      <span className="win98-history-model-cell">
                        <Win98Icon type="models" size={18} />
                        {MODEL_META[pred.modelType]?.label || pred.modelType}
                      </span>
                    </td>
                    <td>{summarize(pred)}</td>
                    <td>{formatDate(pred.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RetroWindow>
  );
}
