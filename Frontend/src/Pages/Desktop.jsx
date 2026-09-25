import React from "react";
import { Link } from "react-router-dom";

export default function Desktop() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div
        className="text-center max-w-xl w-full p-8 border-4 border-slate-900 rounded-xl shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg, #fdfbff 0%, #f0ecfa 50%, #e6ddfa 100%)",
        }}
      >
        <div className="text-6xl mb-4">🎵</div>

        <h1
          className="text-4xl font-bold mb-2"
          style={{
            color: "#7c5cbf",
            letterSpacing: "2px",
            textShadow: "2px 2px 0 #cdbdf0",
          }}
        >
          ✧ MOODWAVE ✧
        </h1>

        <p className="text-slate-700 mb-1 font-bold">
          Music Emotion Analysis
        </p>
        

        <div className="border-t-2 border-dotted border-purple-300 my-4" />

        

        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <Link to="/home" className="retro-pill bg-pink-300">
            🏠 Home
          </Link>
          <Link to="/about" className="retro-pill bg-yellow-200">
            📖 About
          </Link>
          <Link to="/findings" className="retro-pill bg-teal-200">
            📊 Dashboard
          </Link>
          <Link to="/models" className="retro-pill bg-purple-300">
            🧠 Models
          </Link>
        </div>

        <div className="mt-8 text-[10px] text-purple-600">
          ✦ ✦ ✦ thanks for visiting ✦ ✦ ✦
        </div>
      </div>
    </div>
  );
}