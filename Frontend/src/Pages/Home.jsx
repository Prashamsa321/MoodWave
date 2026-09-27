import { useNavigate } from "react-router-dom";
import RetroWindow from "../components/RetroWindow";
import Win98Icon from "../components/Win98Icon";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const openProtected = (path) => navigate(isAuthenticated ? path : "/login");

  return (
    <RetroWindow title="MoodWave - Home" appIcon="♪" statusText="Ready">
      <div className="win98-app-page">
        <div className="win98-page-toolbar">
          <button type="button" className="retro-btn" onClick={() => navigate("/")}>Desktop</button>
          <button type="button" className="retro-btn" onClick={() => openProtected("/findings")}>Reports</button>
          <button type="button" className="retro-btn" onClick={() => openProtected("/models")}>Models</button>
          <div className="win98-toolbar-address">
            <span>Address</span>
            <div className="win98-address-box">MoodWave\Home</div>
          </div>
        </div>

        <div className="win98-home-banner">
          <div className="win98-home-logo" aria-hidden="true">♪</div>
          <div>
            <h1>MoodWave</h1>
            <p>Music Emotion Analysis &amp; Machine Learning Explorer</p>
          </div>
        </div>

        <div className="win98-home-grid">
          <fieldset className="win98-groupbox">
            <legend>Welcome</legend>
            <div className="win98-info-row">
              <Win98Icon type="computer" size={42} />
              <div>
                <strong>Welcome to MoodWave.</strong>
                <p>
                  This project explores how measurable audio features relate to mood,
                  genre, popularity and similarity across a large Spotify song dataset.
                </p>
              </div>
            </div>
            <div className="win98-rule" />
            <p>
              Six machine-learning workflows are available from the Models application.
              The Reports application contains the generated figures and written findings.
            </p>
          </fieldset>

          <fieldset className="win98-groupbox">
            <legend>Project information</legend>
            <div className="win98-properties-box">
              <Property label="Songs" value="115,000+" />
              <Property label="ML models" value="6" />
              <Property label="Report groups" value="9" />
              <Property label="Interface" value="Windows 98" />
            </div>
          </fieldset>
        </div>

        <fieldset className="win98-groupbox win98-quick-start">
          <legend>Quick start</legend>
          <div className="win98-quick-step"><span>1</span><p>Open <b>MODELS</b> from the desktop or Start menu.</p></div>
          <div className="win98-quick-step"><span>2</span><p>Select one of the six models from the application menu bar.</p></div>
          <div className="win98-quick-step"><span>3</span><p>Adjust the classic trackbar controls and run the model.</p></div>
          <div className="win98-quick-step"><span>4</span><p>Open <b>REPORTS</b> to inspect the figures and analysis produced by the project.</p></div>
          <div className="win98-action-row">
            <button type="button" className="retro-btn" onClick={() => navigate("/about")}>About...</button>
            <button type="button" className="retro-btn win98-default-button" onClick={() => openProtected("/models")}>Open Models</button>
          </div>
        </fieldset>
      </div>
    </RetroWindow>
  );
}

function Property({ label, value }) {
  return (
    <div className="win98-property-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
