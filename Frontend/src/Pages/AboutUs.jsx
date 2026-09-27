import RetroWindow from "../components/RetroWindow";
import Win98Icon from "../components/Win98Icon";

const TEAM = [
  ["Pragya Gurung", "ML Training + Frontend"],
  ["Prashamsa Lamsal", "Frontend + Integration"],
  ["Rozina Chhetri", "Analysis + ML Training"],
];

const STACK = [
  "React", "Vite", "Tailwind CSS", "Node.js", "Express", "MongoDB",
  "Python", "FastAPI", "scikit-learn", "pandas",
];

export default function AboutUs() {
  return (
    <RetroWindow title="About MoodWave" appIcon="?" statusText="MoodWave project information">
      <div className="win98-app-page win98-about-page">
        <div className="win98-about-header">
          <Win98Icon type="info" size={48} />
          <div>
            <h1>MoodWave</h1>
            <p>Music Emotion Analysis</p>
            <small>Data Science / Machine Learning Project</small>
          </div>
        </div>

        <div className="win98-inset-display win98-about-question">
          “Can we quantify the emotional fingerprint of a song using measurable audio features?”
        </div>

        <div className="win98-about-grid">
          <fieldset className="win98-groupbox">
            <legend>Team</legend>
            <div className="win98-listbox">
              {TEAM.map(([name, role]) => (
                <div className="win98-team-row" key={name}>
                  <Win98Icon type="user" size={28} />
                  <div><strong>{name}</strong><span>{role}</span></div>
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className="win98-groupbox">
            <legend>Project goals</legend>
            <ul className="win98-check-list">
              <li>Clean and explore the music datasets.</li>
              <li>Study mood, genre, country and historical patterns.</li>
              <li>Train classification, regression and clustering models.</li>
              <li>Expose results through an interactive web application.</li>
            </ul>
          </fieldset>
        </div>

        <fieldset className="win98-groupbox">
          <legend>Technology</legend>
          <div className="win98-tech-list">
            {STACK.map((item) => <span className="win98-tech-item" key={item}>{item}</span>)}
          </div>
        </fieldset>

        <div className="win98-about-footer">
          <span>6th Semester BCA Project</span>
          <span>MoodWave</span>
        </div>
      </div>
    </RetroWindow>
  );
}
