import { useNavigate } from "react-router-dom";
import RetroWindow from "../components/RetroWindow";
import Win98Icon from "../components/Win98Icon";
import { useAuth } from "../context/AuthContext";

const TEAM = [
  ["Pragya Gurung", "ML Training + Frontend"],
  ["Prashamsa Lamsal", "Dashboard + ML Training"],
  ["Rozina Chhetri", "Analysis + ML Training"],
];

const STACK = [
  "React", "Vite", "Tailwind CSS", "Node.js", "Express", "MongoDB",
  "Python", "FastAPI", "scikit-learn", "pandas",
];


export default function AboutUs() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const openProtected = (path) => navigate(isAuthenticated ? path : "/login");

  return (
    <RetroWindow windowId="/about" title="About MoodWave" appIcon="?" statusText="MoodWave project information">
      <div className="win98-home-web win98-about-web">
        <div className="win98-home-web-grid win98-about-web-grid">
          <aside className="win98-home-side-column">

            <AboutPanel title="Team" icon="user">
              <div className="win98-about-team-list">
                {TEAM.map(([name, role], index) => (
                  <div className="win98-about-team-card" key={name}>
                    <div className="win98-about-team-number">{index + 1}</div>
                    <div>
                      <strong>{name}</strong>
                      <span>{role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </AboutPanel>

            <AboutPanel title="Links" compact>
              <div className="win98-home-link-list">
                <AboutLink label="RETURN HOME" onClick={() => navigate("/home")} />
                <AboutLink label="OPEN MODELS" onClick={() => openProtected("/models")} />
                <AboutLink label="VIEW REPORTS" onClick={() => openProtected("/findings")} />
              </div>
            </AboutPanel>

            <AboutPanel title="Research Question">
              <div className="win98-about-question-card">
                <span aria-hidden="true">“</span>
                <p>Can we quantify the emotional fingerprint of a song using measurable audio features?</p>
                <span aria-hidden="true">”</span>
              </div>
            </AboutPanel>
          </aside>

          <section className="win98-home-main-column">
            <AboutPanel title="About MoodWave" wide>
              <div className="win98-home-about-copy">
                <p>
                  <strong>MoodWave</strong> is a data-science and machine-learning project built around
                  large Spotify song datasets. The project studies measurable audio characteristics
                  instead of looking at music only through titles, artists and genre names.
                </p>
                <p>
                  Features such as energy, valence, danceability, tempo, loudness, acousticness and
                  instrumentalness are explored to understand patterns in mood, genre, popularity,
                  clustering and similarity.
                </p>
                <div className="win98-home-callout">
                  The goal is to turn numerical audio features into understandable predictions,
                  visualizations and written findings that can be explored through the MoodWave desktop.
                </div>
              </div>
            </AboutPanel>



            <AboutPanel title="Technology" icon="computer">
              <div className="win98-about-tech-grid">
                {STACK.map((item) => (
                  <span className="win98-about-tech-chip" key={item}>{item}</span>
                ))}
              </div>
            </AboutPanel>
          </section>
        </div>
      </div>
    </RetroWindow>
  );
}

function AboutPanel({ title, icon, children, compact = false, wide = false }) {
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

function AboutLink({ label, onClick }) {
  return (
    <button type="button" className="win98-home-link" onClick={onClick}>
      &gt;&gt;&nbsp; <span>{label}</span> &nbsp;&lt;&lt;
    </button>
  );
}
