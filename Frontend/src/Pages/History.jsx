import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RetroWindow from "../components/RetroWindow";
import api from "../services/api";

const MODEL_META = {
  mood: { icon: "🎭", label: "Mood Classifier", color: "#7c5cbf" },
  genre: { icon: "🎸", label: "Genre Classifier", color: "#e85d5d" },
  popularity: { icon: "📈", label: "Popularity Predictor", color: "#22c55e" },
  cluster: { icon: "🔵", label: "Emotion Grouping", color: "#3b82f6" },
  pca: { icon: "📉", label: "Emotion Map", color: "#f59e0b" },
  similar: { icon: "🎧", label: "Similar Songs", color: "#67c6c3" },
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

  const filtered =
    filter === "all"
      ? predictions
      : predictions.filter((p) => p.modelType === filter);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
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
          ? `Top: ${out.top_genres[0].genre} (${(out.top_genres[0].probability * 100).toFixed(1)}%)`
          : "Genre predicted";
      case "popularity":
        return `Score: ${out.popularity ?? "?"}/100`;
      case "cluster":
        return out.cluster_id !== undefined
          ? `Cluster ${out.cluster_id} — ${out.profile?.common_genres || ""}`
          : "Cluster predicted";
      case "pca":
        return `Position: (${(out.pca_1 ?? 0).toFixed(2)}, ${(out.pca_2 ?? 0).toFixed(2)})`;
      case "similar":
        return out.recommendations?.length
          ? `${out.recommendations.length} songs recommended`
          : "Similar songs found";
      default:
        return "Prediction saved";
    }
  };

  return (
    <RetroWindow title="MY HISTORY">
          <div className="max-w-4xl mx-auto">

      <h1 className="retro-h1">📜 My Prediction History</h1>
      <p className="text-sm text-purple-700 mb-4">
        {predictions.length === 0
          ? "You haven't made any predictions yet."
          : `You have ${predictions.length} saved prediction${
              predictions.length !== 1 ? "s" : ""
            }.`}
      </p>

      {/* Filter row */}
      {predictions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className="retro-pill"
            style={{
              background: filter === "all" ? "#7c5cbf" : "#e0d8f0",
              color: filter === "all" ? "#fff" : "#1e293b",
            }}
          >
            All ({predictions.length})
          </button>
          {Object.entries(MODEL_META).map(([key, meta]) => {
            const count = predictions.filter((p) => p.modelType === key).length;
            if (count === 0) return null;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="retro-pill"
                style={{
                  background: filter === key ? meta.color : "#e0d8f0",
                  color: filter === key ? "#fff" : "#1e293b",
                }}
              >
                {meta.icon} {count}
              </button>
            );
          })}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8 text-purple-700 text-sm">
          ⏳ Loading history...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 border-2 border-red-700 rounded p-4 text-red-900 text-sm">
          Error: {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && predictions.length === 0 && (
        <div className="bg-white border-2 border-dashed border-purple-400 rounded-lg p-8 text-center">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-sm text-slate-700 mb-4">
            No predictions yet.
          </p>
          <Link
            to="/models"
            className="retro-btn retro-btn-primary px-5 py-2 text-sm"
          >
            Go to Models →
          </Link>
        </div>
      )}

      {/* Predictions list */}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((pred) => {
            const meta = MODEL_META[pred.modelType] || {
              icon: "🔮",
              label: pred.modelType,
              color: "#7c5cbf",
            };
            return (
              <div
                key={pred._id}
                className="bg-white border-2 border-slate-900 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                    style={{ background: meta.color, color: "#fff" }}
                  >
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="font-bold text-sm text-purple-700">
                        {meta.label}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {formatDate(pred.createdAt)}
                      </div>
                    </div>
                    <div className="text-xs text-slate-700 mt-1">
                      {summarize(pred)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 text-center text-xs text-purple-700">
        End of History 
      </div>
    </div>
    </RetroWindow>
  );
}