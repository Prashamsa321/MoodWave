import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import FeatureSlider from "../components/demos/FeatureSlider";

const SEARCH_DEBOUNCE_MS = 180;

const SIMILARITY_FEATURES = [
  "danceability",
  "energy",
  "loudness",
  "speechiness",
  "acousticness",
  "instrumentalness",
  "liveness",
  "valence",
  "tempo",
  "duration_ms",
];

const DEFAULTS = {
  danceability: 0.68,
  energy: 0.74,
  loudness: -6.2,
  speechiness: 0.06,
  acousticness: 0.18,
  instrumentalness: 0.01,
  liveness: 0.14,
  valence: 0.57,
  tempo: 124.5,
  duration_ms: 213000,
};

function initialValues() {
  return { ...DEFAULTS };
}

function cleanFeatureValue(song, feature) {
  const value = Number(song?.[feature]);
  return Number.isFinite(value) ? value : DEFAULTS[feature];
}

export default function AudioSimilarity() {
  const { isAuthenticated } = useAuth();

  const [values, setValues] = useState(initialValues);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [fineTuned, setFineTuned] = useState(false);
  const searchRequestId = useRef(0);

  useEffect(() => {
    const query = searchQuery.trim();

    if (!searchOpen || !query) {
      setSearchSuggestions([]);
      setSearching(false);
      return undefined;
    }

    const requestId = ++searchRequestId.current;
    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await api.get("/songs/search", {
          params: { q: query, limit: 8, mode: "10d" },
        });

        if (requestId === searchRequestId.current) {
          setSearchSuggestions(data.songs || []);
        }
      } catch (err) {
        if (requestId === searchRequestId.current) {
          console.error("10-feature song search failed:", err);
          setSearchSuggestions([]);
        }
      } finally {
        if (requestId === searchRequestId.current) {
          setSearching(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchOpen, searchQuery]);

  const findSimilar = async ({
    nextValues = values,
    sourceSong = selectedSong,
    wasFineTuned = fineTuned,
  } = {}) => {
    setLoading(true);
    setError("");

    try {
      const request = {
        ...nextValues,
        limit: 20,
        ...(sourceSong?.track_id
          ? { exclude_track_id: String(sourceSong.track_id) }
          : {}),
      };

      const { data } = await api.post("/predictions/similar", request);
      setResult(data);

      if (isAuthenticated) {
        try {
          await api.post("/predictions", {
            modelType: "similar",
            inputFeatures: {
              ...nextValues,
              similarity_mode: "10_feature_nearest_neighbors",
              ...(sourceSong
                ? {
                    source_track_id: sourceSong.track_id || "",
                    source_track_name: sourceSong.track_name || "",
                    source_artist_name: sourceSong.artist_name || "",
                    fine_tuned_after_selection: wasFineTuned,
                  }
                : {}),
            },
            output: data,
          });
        } catch (saveErr) {
          console.warn("Similarity history save failed:", saveErr.message);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not find similar songs. Is the ML service running?",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSong = (song) => {
    const nextValues = {};
    SIMILARITY_FEATURES.forEach((feature) => {
      nextValues[feature] = cleanFeatureValue(song, feature);
    });

    setValues(nextValues);
    setSelectedSong(song);
    setFineTuned(false);
    setResult(null);
    setError("");
    setSearchQuery(
      `${song.track_name || "Unknown track"} — ${song.artist_name || "Unknown artist"}`,
    );
    setSearchSuggestions([]);
    setSearchOpen(false);

    // Match the 2-feature workflow: selecting a catalog song immediately
    // loads its 10-feature profile and retrieves the closest 20 tracks.
    findSimilar({
      nextValues,
      sourceSong: song,
      wasFineTuned: false,
    });
  };

  const handleFeatureChange = (feature, value) => {
    setValues((previous) => ({ ...previous, [feature]: value }));
    setResult(null);
    if (selectedSong) setFineTuned(true);
  };

  const reset = () => {
    setValues(initialValues());
    setResult(null);
    setError("");
    setSearchQuery("");
    setSearchSuggestions([]);
    setSearchOpen(false);
    setSelectedSong(null);
    setFineTuned(false);
  };

  const recommendations = result?.recommendations || result?.tracks || [];

  return (
    <div className="win98-similar-layout win98-similar-10d-layout">
      <fieldset className="win98-groupbox win98-input-group">
        <legend>10-Feature Audio Similarity</legend>

        <div className="win98-song-search-block">
          <div className="win98-static-label">Search catalog song</div>
          <div className="win98-search-field-wrap">
            <span className="win98-search-icon" aria-hidden="true">♫</span>
            <input
              type="text"
              className="win98-search-input"
              value={searchQuery}
              placeholder="Start typing a song or artist..."
              autoComplete="off"
              spellCheck={false}
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchOpen(true);
                setSelectedSong(null);
                setFineTuned(false);
                setResult(null);
              }}
              onBlur={() => {
                window.setTimeout(() => setSearchOpen(false), 120);
              }}
            />
          </div>

          {searchOpen && searchQuery.trim() && (
            <div className="win98-search-suggestions" role="listbox">
              {searching && (
                <div className="win98-search-status">Searching track catalog...</div>
              )}

              {!searching && searchSuggestions.length === 0 && (
                <div className="win98-search-status">No matching songs found.</div>
              )}

              {!searching &&
                searchSuggestions.map((song) => (
                  <button
                    type="button"
                    role="option"
                    key={song.track_id || `${song.track_name}-${song.artist_name}`}
                    className="win98-search-option"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelectSong(song)}
                  >
                    <span className="win98-search-option-icon" aria-hidden="true">♫</span>
                    <span className="win98-search-option-main">
                      <strong>{song.track_name || "Unknown track"}</strong>
                      <span>{song.artist_name || "Unknown artist"}</span>
                    </span>
                    <span className="win98-search-option-meta">
                      E {Number(song.energy).toFixed(2)} · V {Number(song.valence).toFixed(2)}
                    </span>
                  </button>
                ))}
            </div>
          )}

          {selectedSong && (
            <div className="win98-selected-song">
              <div className="win98-selected-song-icon" aria-hidden="true">♫</div>
              <div className="win98-selected-song-main">
                <strong>{selectedSong.track_name || "Unknown track"}</strong>
                <span>{selectedSong.artist_name || "Unknown artist"}</span>
                <small>
                  {fineTuned
                    ? "10-feature profile loaded — values have been fine-tuned."
                    : "10-feature profile loaded from the track catalog."}
                </small>
              </div>
            </div>
          )}

          <div className="win98-search-help">
            Select a song to load all 10 audio features. The closest 20 tracks load automatically. You can then modify any value and press Find again to fine-tune the similarity.
          </div>
        </div>

        <div className="win98-divider" />

        <div className="win98-similarity-note">
          Similarity uses standardized Danceability, Energy, Loudness, Speechiness,
          Acousticness, Instrumentalness, Liveness, Valence, Tempo and Duration.
        </div>

        <div className="win98-slider-grid win98-similarity-feature-grid">
          {SIMILARITY_FEATURES.map((feature) => (
            <FeatureSlider
              key={feature}
              feature={feature}
              value={values[feature]}
              onChange={handleFeatureChange}
              compact
            />
          ))}
        </div>

        <div className="win98-action-row">
          <button
            type="button"
            className="retro-btn win98-default-button"
            onClick={findSimilar}
            disabled={loading}
          >
            {loading ? "Finding..." : "Find Top 20 Similar Songs"}
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

      <fieldset className="win98-groupbox win98-result-group">
        <legend>Top 20 Audio Matches</legend>

        {!result && (
          <div className="win98-output-placeholder">
            Select a catalog song for instant 20-track recommendations, or set the 10 audio values manually and click Find.
          </div>
        )}

        {result && (
          <>
            {selectedSong && (
              <div className="win98-recommend-source">
                Based on: <strong>{selectedSong.track_name}</strong>
                {selectedSong.artist_name ? ` — ${selectedSong.artist_name}` : ""}
                {fineTuned ? " (fine-tuned profile)" : ""}
              </div>
            )}

            <div className="win98-listbox win98-song-list win98-song-list-10d">
              {recommendations.map((song, index) => (
                <div key={song.track_id || index} className="win98-song-row win98-song-row-10d">
                  <div className="win98-song-index">{index + 1}</div>
                  <div className="win98-song-main">
                    <strong>{song.track_name || "Unknown"}</strong>
                    <span>{song.artist_name || "Unknown artist"}</span>
                    {song.primary_genre && <small>{song.primary_genre}</small>}
                  </div>
                  <div className="win98-song-metrics win98-song-metrics-10d">
                    <span>E {Number(song.energy ?? 0).toFixed(2)}</span>
                    <span>V {Number(song.valence ?? 0).toFixed(2)}</span>
                    <span>D {Number(song.danceability ?? 0).toFixed(2)}</span>
                    <span>d {Number(song.distance ?? 0).toFixed(3)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </fieldset>
    </div>
  );
}
