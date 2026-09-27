export default function GenreDemo({ result }) {
  if (!result) return null;

  return (
    <div className="win98-result-panel">
      <div className="win98-result-label">Top predicted genres</div>
      <div className="win98-listbox">
        {result.top_genres?.map((genre, index) => (
          <div key={`${genre.genre}-${index}`} className="win98-genre-row">
            <span className="win98-list-index">{index + 1}</span>
            <span className="win98-genre-name">{genre.genre}</span>
            <div className="win98-progress">
              <div
                className="win98-progress-fill"
                style={{
                  width: `${Math.max(0, Math.min(100, genre.probability * 100))}%`,
                }}
              />
            </div>
            <span className="win98-probability-value">
              {(genre.probability * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
