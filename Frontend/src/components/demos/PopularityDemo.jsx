export default function PopularityDemo({ result }) {
  if (!result) return null;

  const score = Math.max(0, Math.min(100, Number(result.popularity) || 0));

  return (
    <div className="win98-result-panel">
      <div className="win98-result-label">Predicted popularity</div>
      <div className="win98-result-large-value">
        {score.toFixed(Number.isInteger(score) ? 0 : 1)}
        <span> / 100</span>
      </div>

      <div className="win98-progress" aria-label={`Popularity ${score} out of 100`}>
        <div className="win98-progress-fill" style={{ width: `${score}%` }} />
      </div>

      <div className="win98-result-note">
        {score >= 70
          ? "The model places this track in the higher predicted-popularity range."
          : score >= 40
            ? "The model places this track in the middle predicted-popularity range."
            : "The model places this track in the lower predicted-popularity range."}
      </div>
    </div>
  );
}
