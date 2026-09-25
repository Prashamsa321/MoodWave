export default function GenreDemo({ result }) {
    if (!result) {
      return (
        <div className="text-xs text-purple-600 italic">
          Run the shared controls above to see the prediction.
        </div>
      );
    }
  
    return (
      <div className="bg-white border-2 border-slate-900 rounded p-4">
        <div className="text-xs opacity-60 mb-2">Top 3 Genres</div>
        <div className="space-y-2">
          {result.top_genres?.map((g, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs w-6 shrink-0 font-bold text-purple-600">
                #{i + 1}
              </span>
              <span className="text-sm flex-1 truncate">{g.genre}</span>
              <div className="w-24 bg-slate-200 rounded h-3 border border-slate-400 overflow-hidden shrink-0">
                <div
                  className="h-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${(g.probability * 100).toFixed(1)}%` }}
                />
              </div>
              <span className="text-xs w-12 text-right font-mono opacity-70">
                {(g.probability * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }