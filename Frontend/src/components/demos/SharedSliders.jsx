export default function SharedSliders({
    energy,
    setEnergy,
    valence,
    setValence,
    onRun,
    loading,
    error,
  }) {
    const quadrant =
      valence >= 0.5
        ? energy >= 0.5 ? "Euphoric" : "Peaceful"
        : energy >= 0.5 ? "Aggressive" : "Melancholic";
  
    const quadrantColor = {
      Euphoric: "text-yellow-600",
      Peaceful: "text-teal-600",
      Aggressive: "text-red-600",
      Melancholic: "text-indigo-600",
    }[quadrant];
  
    return (
      <div className="border-2 border-dashed border-purple-400 rounded-lg p-4 bg-purple-50 mb-6">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="text-sm font-bold text-purple-700">
            ⚙️ Shared Controls — drag once, all models below update
          </div>
          <div className={`text-xs font-bold ${quadrantColor}`}>
            Quadrant: {quadrant}
          </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
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
  
          <div>
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
        </div>
  
        <button
          onClick={onRun}
          disabled={loading}
          className="retro-btn retro-btn-primary w-full disabled:opacity-50"
        >
          {loading ? "⏳ Running all models..." : "▶ Run All Models"}
        </button>
  
        {error && (
          <div className="mt-3 text-xs bg-red-200 border border-red-700 text-red-900 rounded p-2">
            {error}
          </div>
        )}
      </div>
    );
  }