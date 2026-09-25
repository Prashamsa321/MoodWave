import RetroWindow from "../components/RetroWindow";

export default function Home() {
  return (
    <RetroWindow title="HOME">
      <h1 className="retro-h1">✧ Welcome to MoodWave ✧</h1>

      <div className="flex items-start gap-6 flex-wrap">
        <div
          className="w-40 h-40 shrink-0 border-4 border-slate-900 rounded-lg flex items-center justify-center text-6xl"
          style={{ background: "linear-gradient(135deg, #cdbdf0, #f8c8dc)" }}
        >
          🎵
        </div>

        <div className="flex-1 min-w-[260px]">
          <p className="mb-3 text-sm leading-relaxed">
            Hi! This is <strong>MoodWave</strong> — a music emotion
            exploration project.
          </p>
          <p className="mb-3 text-sm leading-relaxed">
            We trained <strong>6 machine learning models</strong> on a
            dataset of <strong>115,000+ songs</strong> to understand how
            music makes us feel.
          </p>
          <p className="mb-3 text-sm leading-relaxed">
            Drag a mood slider on the Models page → get 10 songs that match.
            Browse our Findings to see what the data revealed.
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="retro-pill bg-pink-300">🎧 115K songs</span>
            <span className="retro-pill bg-teal-200">🧠 6 ML models</span>
            <span className="retro-pill bg-yellow-200">📊 10 finding themes</span>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t-2 border-dotted border-purple-300 pt-6">
        <h2 className="retro-h2">✧ Quick Start</h2>
        <ol className="text-sm space-y-2 list-decimal list-inside">
          <li>Click <strong>MODELS</strong> in the top-left menu</li>
          <li>Expand <strong>Similar Songs NN</strong></li>
          <li>Drag the Energy + Valence sliders</li>
          <li>Click <strong>Recommend Songs</strong> → 10 matching tracks appear</li>
        </ol>
      </div>

      <div className="mt-8 text-center text-xs text-purple-700">
        ✦ ✦ ✦ thanks for visiting ✦ ✦ ✦
      </div>
    </RetroWindow>
  );
}