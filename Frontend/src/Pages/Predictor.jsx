import React, { useState } from "react";
import api from "../services/api";

export default function Predictor() {
  const [energy, setEnergy] = useState(0.5);
  const [valence, setValence] = useState(0.5);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRecommend = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/predictions/recommend", {
        energy,
        valence,
        limit: 10,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch recommendations. Is the ML service running?"
      );
    } finally {
      setLoading(false);
    }
  };

  // Quadrant label from current values
  const quadrant =
    valence >= 0.5
      ? energy >= 0.5 ? "Euphoric" : "Peaceful"
      : energy >= 0.5 ? "Aggressive" : "Melancholic";

  const quadrantColor = {
    Euphoric: "text-yellow-400",
    Peaceful: "text-teal-400",
    Aggressive: "text-red-400",
    Melancholic: "text-indigo-400",
  }[quadrant];

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">🎵 Mood Predictor</h1>
      <p className="text-gray-400 mb-6">
        Set how energetic and how positive the song should feel. We'll find the
        10 closest songs from our catalog.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders */}
        <div className="bg-slate-900 rounded-lg p-5 border border-slate-800">
          <h2 className="text-lg font-semibold mb-4">Set the Mood</h2>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Energy</span>
              <span className="text-slate-400">{energy.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Calm</span>
              <span>Intense</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Valence (positivity)</span>
              <span className="text-slate-400">{valence.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={valence}
              onChange={(e) => setValence(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Sad</span>
              <span>Happy</span>
            </div>
          </div>

          {/* Quadrant preview */}
          <div className="bg-slate-800 rounded-lg p-4 mb-4">
            <div className="text-xs text-slate-400 mb-1">Current quadrant</div>
            <div className={`text-2xl font-bold ${quadrantColor}`}>
              {quadrant}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRecommend}
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Finding songs..." : "🎯 Recommend Songs"}
            </button>
            <button
              onClick={() => {
                setEnergy(0.5);
                setValence(0.5);
                setResult(null);
                setError("");
              }}
              className="px-5 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg transition"
            >
              Reset
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-900/50 border border-red-500 rounded p-3 text-red-200 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-slate-900 rounded-lg p-5 border border-slate-800">
          <h2 className="text-lg font-semibold mb-4">
            Recommended Songs {result && `(${result.count})`}
          </h2>

          {!result && (
            <p className="text-slate-500 text-sm">
              Drag the sliders and click "Recommend Songs".
            </p>
          )}

          {result && (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {result.recommendations.map((song, i) => (
                <div
                  key={song.track_id || i}
                  className="bg-slate-800 rounded-lg p-3 hover:bg-slate-750 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {i + 1}. {song.track_name || "Unknown"}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {song.artist_name || "Unknown artist"}
                      </div>
                      {song.primary_genre && (
                        <span className="inline-block mt-1 text-xs bg-slate-700 rounded px-2 py-0.5">
                          {song.primary_genre}
                        </span>
                      )}
                    </div>
                    <div className="text-right text-xs text-slate-500 shrink-0">
                      <div>E: {song.energy?.toFixed(2)}</div>
                      <div>V: {song.valence?.toFixed(2)}</div>
                      <div className="text-purple-400 mt-1">
                        d: {song.distance?.toFixed(3)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}