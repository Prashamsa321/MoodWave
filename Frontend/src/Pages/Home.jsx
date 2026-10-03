import { useNavigate } from "react-router-dom";
import RetroWindow from "../components/RetroWindow";
import Win98Icon from "../components/Win98Icon";
import { useAuth } from "../context/AuthContext";

const MODELS = [
  "Popularity Predictor",
  "Mood Detector",
  "Genre Classifier",
  "Emotion Grouping",
  "Emotion Map",
  "Find Similar Songs",
];

const STATS = [
  ["Songs", "115,000+"],
  ["ML models", "6"],
  ["Report groups", "9"],
  ["Mood classes", "4"],
  ["Audio clusters", "5"],
];

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const openProtected = (path) => navigate(isAuthenticated ? path : "/login");

  return (
    <RetroWindow windowId="/home" title="MoodWave - Home" appIcon="♪" statusText="Welcome to MoodWave">
      <div className="win98-home-web">
        <div className="win98-home-web-grid">
          <aside className="win98-home-side-column">
            <HomePanel title="Welcome!" icon="computer">
              <div className="win98-home-welcome-art">
                <div className="win98-home-logo-large" aria-hidden="true">♪</div>
                <strong>MoodWave</strong>
                <span>Data Science × Music</span>
              </div>
              <p>
                Explore how measurable Spotify audio features connect to mood, genre,
                popularity, clustering and song similarity.
              </p>
            </HomePanel>

            <HomePanel title="Links" compact>
              <div className="win98-home-link-list">
                <HomeLink label="OPEN MODELS" onClick={() => openProtected("/models")} />
                <HomeLink label="VIEW REPORTS" onClick={() => openProtected("/findings")} />
                <HomeLink label="ABOUT US" onClick={() => navigate("/about")} />
                {isAuthenticated && (
                  <>
                    <HomeLink label="MY PROFILE" onClick={() => navigate("/profile")} />
                    <HomeLink label="MODEL HISTORY" onClick={() => navigate("/history")} />
                  </>
                )}
              </div>
            </HomePanel>

            <HomePanel title="Project Stats" icon="report">
              <div className="win98-home-stats">
                {STATS.map(([label, value]) => (
                  <div className="win98-home-stat-row" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </HomePanel>
          </aside>

          <section className="win98-home-main-column">
            <HomePanel title="About MoodWave" wide>
              <div className="win98-home-about-copy">
                <p>
                  <strong>MoodWave</strong> is a machine-learning project built around a large
                  Spotify song dataset. Instead of treating music as only titles and genres,
                  the project studies numerical audio properties such as energy, valence,
                  danceability, tempo, loudness and acousticness.
                </p>
                <p>
                  Those features are used to train prediction and discovery models, then the
                  results are presented through this Windows 98 inspired desktop interface.
                </p>
                <div className="win98-home-callout">
                  Open more than one application at once, move the windows around, inspect the
                  reports, and compare model outputs just like a tiny desktop environment.
                </div>
              </div>
            </HomePanel>

            <div className="win98-home-main-split">
              <HomePanel title="Six Model Workflows" icon="models">
                <ol className="win98-home-model-list">
                  {MODELS.map((model, index) => (
                    <li key={model}>
                      <span>{index + 1}</span>
                      <span className="win98-home-model-name">{model}</span>
                    </li>
                  ))}
                </ol>
              </HomePanel>

              <HomePanel title="What You Can Explore" icon="book">
                <ul className="win98-home-feature-list">
                  <li>How audio features relate to perceived mood.</li>
                  <li>Genre patterns across measurable track properties.</li>
                  <li>Historical changes in valence, energy and mood.</li>
                  <li>Popularity prediction from audio characteristics.</li>
                  <li>K-Means clusters and PCA emotion-space visualization.</li>
                  <li>Song recommendations using emotional similarity.</li>
                </ul>
              </HomePanel>
            </div>

          </section>
        </div>
      </div>
    </RetroWindow>
  );
}

function HomePanel({ title, icon, children, compact = false, wide = false }) {
  return (
    <section className={`win98-home-panel ${compact ? "is-compact" : ""} ${wide ? "is-wide" : ""}`.trim()}>
      <div className="win98-home-panel-title">
        <span>{title}</span>
        {icon && <Win98Icon type={icon} size={18} />}
      </div>
      <div className="win98-home-panel-body">{children}</div>
    </section>
  );
}

function HomeLink({ label, onClick }) {
  return (
    <button type="button" className="win98-home-link" onClick={onClick}>
      &gt;&gt;&nbsp; <span>{label}</span> &nbsp;&lt;&lt;
    </button>
  );
}
