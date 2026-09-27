export default function MoodDemo({ result }) {
  if (!result) return null;

  return (
    <div className="win98-result-panel">
      <div className="win98-result-label">Predicted mood</div>
      <div className="win98-inset-display win98-result-heading">{result.mood}</div>

      <div className="win98-probability-list">
        {Object.entries(result.mood_probabilities || result.probabilities || {})
          .sort(([, a], [, b]) => b - a)
          .map(([mood, probability]) => (
            <div key={mood} className="win98-probability-row">
              <span className="win98-probability-name">{mood}</span>
              <div className="win98-progress">
                <div
                  className="win98-progress-fill"
                  style={{ width: `${Math.max(0, Math.min(100, probability * 100))}%` }}
                />
              </div>
              <span className="win98-probability-value">
                {(probability * 100).toFixed(1)}%
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
