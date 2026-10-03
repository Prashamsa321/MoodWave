import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import FeatureHelpLabel from "../components/FeatureHelpLabel";

export default function MoodExplore() {
  const { isAuthenticated } = useAuth();
  const [energy, setEnergy] = useState(0.5);
  const [valence, setValence] = useState(0.5);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRecommend = async () => {
    setLoading(true);
    setError("");

    try {
      const request = {
        energy,
        valence,
        limit: 10,
      };

      const { data } = await api.post("/predictions/recommend", request);
      setResult(data);

      // Keep Find Similar Songs in Prediction History just like every other
      // model. Saving is deliberately best-effort so a history write failure
      // never hides recommendations that were returned successfully.
      if (isAuthenticated) {
        try {
          await api.post("/predictions", {
            modelType: "similar",
            inputFeatures: request,
            output: data,
          });
        } catch (saveErr) {
          console.warn("Similar-song history save failed:", saveErr);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setEnergy(0.5);
    setValence(0.5);
    setResult(null);
    setError("");
  };

  const quadrant =
    valence >= 0.5
      ? energy >= 0.5
        ? "Euphoric"
        : "Peaceful"
      : energy >= 0.5
        ? "Aggressive"
        : "Melancholic";

  return (
    <div className="win98-similar-layout">
      <fieldset className="win98-groupbox">
        <legend>Mood Position</legend>

        <div className="win98-feature-control">
          <div className="win98-feature-label-row">
            <FeatureHelpLabel feature="energy" htmlFor="similar-energy" />
            <output className="win98-value-box" htmlFor="similar-energy">
              {energy.toFixed(2)}
            </output>
          </div>
          <div className="win98-trackbar-row">
            <span className="win98-slider-edge">Calm</span>
            <input
              id="similar-energy"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={energy}
              onChange={(event) => setEnergy(Number(event.target.value))}
              className="retro-slider win98-trackbar"
            />
            <span className="win98-slider-edge">Intense</span>
          </div>
        </div>

        <div className="win98-feature-control">
          <div className="win98-feature-label-row">
            <FeatureHelpLabel feature="valence" htmlFor="similar-valence" label="Valence (positivity)" />
            <output className="win98-value-box" htmlFor="similar-valence">
              {valence.toFixed(2)}
            </output>
          </div>
          <div className="win98-trackbar-row">
            <span className="win98-slider-edge">Sad</span>
            <input
              id="similar-valence"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={valence}
              onChange={(event) => setValence(Number(event.target.value))}
              className="retro-slider win98-trackbar"
            />
            <span className="win98-slider-edge">Happy</span>
          </div>
        </div>

        <div className="win98-static-label">Current quadrant</div>
        <div className="win98-inset-display win98-result-heading">{quadrant}</div>

        <div className="win98-action-row">
          <button
            type="button"
            className="retro-btn win98-default-button"
            onClick={handleRecommend}
            disabled={loading}
          >
            {loading ? "Finding..." : "Find Similar Songs"}
          </button>
          <button type="button" className="retro-btn" onClick={reset} disabled={loading}>
            Reset
          </button>
        </div>

        {error && (
          <div className="win98-message-box is-error" role="alert">
            <span className="win98-message-icon" aria-hidden="true">!</span>
            <span>{error}</span>
          </div>
        )}
      </fieldset>

      <fieldset className="win98-groupbox">
        <legend>Top 10 Songs</legend>

        {!result && (
          <div className="win98-output-placeholder">
            Choose a mood position and click Find Similar Songs.
          </div>
        )}

        {result && (
          <div className="win98-listbox win98-song-list">
            {result.recommendations?.map((song, index) => (
              <div key={song.track_id || index} className="win98-song-row">
                <div className="win98-song-index">{index + 1}</div>
                <div className="win98-song-main">
                  <strong>{song.track_name || "Unknown"}</strong>
                  <span>{song.artist_name || "Unknown artist"}</span>
                  {song.primary_genre && <small>{song.primary_genre}</small>}
                </div>
                <div className="win98-song-metrics">
                  <span>E {song.energy?.toFixed(2)}</span>
                  <span>V {song.valence?.toFixed(2)}</span>
                  <span>d {song.distance?.toFixed(3)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </fieldset>
    </div>
  );
}
