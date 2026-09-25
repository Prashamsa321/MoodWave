export default function PopularityDemo({ result }) {
    if (!result) {
      return (
        <div className="text-xs text-purple-600 italic">
          Run the shared controls above to see the prediction.
        </div>
      );
    }
  
    const score = result.popularity;
    const barColor =
      score >= 70 ? "#6bcf7f" : score >= 40 ? "#ffd93d" : "#ff6b81";
  
    return (
      <div className="bg-white border-2 border-slate-900 rounded p-4">
        <div className="text-xs opacity-60 mb-1">Predicted Popularity</div>
        <div className="text-4xl font-bold mb-3" style={{ color: barColor }}>
          {score}
          <span className="text-lg text-slate-500"> / 100</span>
        </div>
        <div className="w-full bg-slate-200 rounded h-4 border border-slate-900 overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${score}%`, background: barColor }}
          />
        </div>
        <div className="text-[10px] text-purple-700 mt-2 italic">
          {score >= 70
            ? "This song would likely chart well."
            : score >= 40
            ? "Moderate popularity — could go either way."
            : "Niche track — unlikely to chart high."}
        </div>
      </div>
    );
  }