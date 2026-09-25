import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import RetroMenu from "../components/RetroMenu";

export default function RetroLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden retro-bg">
      {/* Sparkles */}
      <div className="sparkles-layer" aria-hidden="true" />

      {/* Menu — horizontal on mobile, vertical on desktop */}
      <RetroMenu />

      {/* Main content — reserves space for the menu */}
      <main className="relative z-10 pt-32 md:pt-8 px-4 md:pl-40 md:pr-8 pb-20 max-w-6xl mx-auto md:mx-auto">
        <Outlet />
      </main>

      {/* Fake taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-8 retro-taskbar z-20 flex items-center px-2 text-xs">
        <button className="retro-start-btn px-3 py-1 mr-2 font-bold">
          🪟 Start
        </button>
        <span className="opacity-70 hidden sm:inline">
          {getPageTitle(location.pathname)}
        </span>
        <span className="ml-auto opacity-70">MoodWave OS v1.0</span>
      </div>
    </div>
  );
}

function getPageTitle(path) {
  if (path === "/") return "🏠 Desktop";
  if (path.includes("findings")) return "📊 Findings";
  if (path.includes("models")) return "🧠 Models";
  if (path.includes("about")) return "📖 About Us";
  if (path.includes("home")) return "🏠 Home";
  return "MoodWave";
}