export default function MoodDemo({ result }) {
    if (!result) {
      return (
        <div className="text-xs text-purple-600 italic">
          Run the shared controls above to see the prediction.
        </div>
      );
    }
  
    const moodColor = {
      Euphoric: "#F4C95D",
      Peaceful: "#67C6C3",
      Aggressive: "#E85D5D",
      Melancholic: "#6C70B5",
    };
  
    return (
      <div className="bg-white border-2 border-slate-900 rounded p-4">
        <div className="text-xs opacity-60 mb-1">Predicted Mood</div>
        <div
          className="text-3xl font-bold mb-3"
          style={{ color: moodColor[result.mood] || "#7c5cbf" }}
        >
          {result.mood}
        </div>
  
        <div className="space-y-2">
          {Object.entries(result.mood_probabilities || {})
            .sort(([, a], [, b]) => b - a)
            .map(([m, p]) => (
              <div key={m} className="flex items-center gap-2 text-xs">
                <span className="w-24 shrink-0">{m}</span>
                <div className="flex-1 bg-slate-200 rounded h-3 border border-slate-400 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${(p * 100).toFixed(1)}%`,
                      background: moodColor[m] || "#7c5cbf",
                    }}
                  />
                </div>
                <span className="w-12 text-right font-mono opacity-70">
                  {(p * 100).toFixed(1)}%
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  }