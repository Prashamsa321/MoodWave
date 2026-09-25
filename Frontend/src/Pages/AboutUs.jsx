import RetroWindow from "../components/RetroWindow";

export default function AboutUs() {
  return (
    <RetroWindow title="ABOUT US">
      <h1 className="retro-h1">✧ About MoodWave ✧</h1>

      <p className="text-sm leading-relaxed mb-4">
        MoodWave is a data science project that bridges <strong>music</strong>{" "}
        and <strong>emotion</strong>. We ask a simple question:
      </p>

      <blockquote className="border-l-4 border-purple-400 bg-purple-50 px-4 py-3 italic text-sm mb-6">
        "Can we quantify the emotional fingerprint of a song using measurable
        audio features?"
      </blockquote>

      <h2 className="retro-h2">🎓 The Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { name: "Pragya Gurung", role: "Frontend + Integration" },
          { name: "Prashamsa Lamsal", role: "ML Training + Analysis" },
          { name: "Rozina Chhetri", role: "ML Training + Analysis" },
        ].map((m) => (
          <div
            key={m.name}
            className="border-2 border-slate-900 rounded-lg p-3 text-center"
            style={{ background: "#f8f5ff" }}
          >
            <div className="text-3xl mb-2">🎀</div>
            <div className="font-bold text-sm">{m.name}</div>
            <div className="text-xs text-purple-700">{m.role}</div>
          </div>
        ))}
      </div>

      <h2 className="retro-h2">🛠 Tech Stack</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          "React", "Vite", "Tailwind", "Node.js", "Express",
          "MongoDB", "Python", "FastAPI", "scikit-learn", "pandas",
        ].map((t) => (
          <span key={t} className="retro-pill bg-purple-200">
            {t}
          </span>
        ))}
      </div>

      <h2 className="retro-h2">🎯 Project Goals</h2>
      <ul className="text-sm space-y-2 list-disc list-inside">
        <li>Collect and clean a large music dataset</li>
        <li>Explore how valence and energy vary across genres and decades</li>
        <li>Train 6 ML models for classification, regression, and clustering</li>
        <li>Build an interactive dashboard for mood-based song discovery</li>
      </ul>

      <div className="mt-8 text-center text-xs text-purple-700">
        ✦ A 6th Semester BCA Project ✦
      </div>
    </RetroWindow>
  );
}