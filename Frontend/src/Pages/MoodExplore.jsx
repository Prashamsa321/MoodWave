import React, { useState } from "react";
import api from "../services/api";

export default function MoodExplore() {
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
        err.response?.data?.message || "Failed to fetch recommendations."
      );
    } finally {
      setLoading(false);
    }
  };

  const quadrant =
    valence >= 0.5
      ? energy >= 0.5
        ? "Euphoric"
        : "Peaceful"
      : energy >= 0.5
      ? "Aggressive"
      : "Melancholic";

  const quadrantColor = {
    Euphoric: "text-yellow-600",
    Peaceful: "text-teal-600",
    Aggressive: "text-red-600",
    Melancholic: "text-indigo-600",
  }[quadrant];

  return (
    <div className="border-2 border-dashed border-purple-400 rounded-lg p-4 bg-purple-50">
      <div className="text-xs font-bold text-purple-700 mb-3">
        Drag the sliders to find the 10 closest songs
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sliders */}
        <div className="bg-white border-2 border-slate-900 rounded p-4">
          <div className="text-xs font-bold mb-3">Set the Mood</div>

          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Energy</span>
              <span className="font-mono">{energy.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="retro-slider"
            />
            <div className="flex justify-between text-[10px] opacity-60 mt-1">
              <span>Calm</span>
              <span>Intense</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Valence (positivity)</span>
              <span className="font-mono">{valence.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={valence}
              onChange={(e) => setValence(Number(e.target.value))}
              className="retro-slider"
            />
            <div className="flex justify-between text-[10px] opacity-60 mt-1">
              <span>Sad</span>
              <span>Happy</span>
            </div>
          </div>

          <div className="bg-purple-100 border-2 border-slate-900 rounded p-3 mb-3 text-center">
            <div className="text-[10px] opacity-60">Current quadrant</div>
            <div className={`text-xl font-bold ${quadrantColor}`}>
              {quadrant}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRecommend}
              disabled={loading}
              className="retro-btn retro-btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? "Finding..." : " Find Similar Songs"}
            </button>
            <button
              onClick={() => {
                setEnergy(0.5);
                setValence(0.5);
                setResult(null);
                setError("");
              }}
              className="retro-btn"
            >
              Reset
            </button>
          </div>

          {error && (
            <div className="mt-3 text-xs bg-red-200 border border-red-700 text-red-900 rounded p-2">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white border-2 border-slate-900 rounded p-4">
          <div className="text-xs font-bold mb-3">
            Recommended Songs {result && `(${result.recommendations?.length})`}
          </div>

          {!result && (
            <p className="text-xs opacity-60">
              Click "Find similar songs" to see results.
            </p>
          )}

          {result && (
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {result.recommendations.map((song, i) => (
                <div
                  key={song.track_id || i}
                  className="bg-purple-50 border border-purple-200 rounded p-2"
                >
                  <div className="flex justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">
                        {i + 1}. {song.track_name || "Unknown"}
                      </div>
                      <div className="text-[10px] opacity-70 truncate">
                        {song.artist_name || "Unknown artist"}
                      </div>
                      {song.primary_genre && (
                        <span className="inline-block mt-1 text-[9px] bg-purple-200 rounded px-1.5 py-0.5">
                          {song.primary_genre}
                        </span>
                      )}
                    </div>
                    <div className="text-right text-[9px] opacity-70 shrink-0 font-mono">
                      <div>E:{song.energy?.toFixed(2)}</div>
                      <div>V:{song.valence?.toFixed(2)}</div>
                      <div className="text-purple-600">
                        d:{song.distance?.toFixed(3)}
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