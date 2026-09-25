import { useNavigate } from "react-router-dom";

export default function LoginRequiredModal({ onClose, featureName = "this section" }) {
  const navigate = useNavigate();

  const handleSignIn = () => {
    onClose();
    navigate("/login");
  };

  const handleSignUp = () => {
    onClose();
    navigate("/register");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(30, 41, 59, 0.75)" }}
      onClick={onClose}
    >
      <div
        className="retro-window max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "popIn 0.15s ease-out" }}
      >
        {/* Title bar */}
        <div className="retro-window-titlebar">
          <div className="retro-window-dots">
            <span className="retro-dot retro-dot-red" />
            <span className="retro-dot retro-dot-yellow" />
            <span className="retro-dot retro-dot-green" />
          </div>
          <span className="retro-window-title">⚠️ ACCESS RESTRICTED</span>
          <div className="retro-window-controls">
            <button
              className="retro-ctrl-btn retro-ctrl-close"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="retro-window-content text-center">
          <div className="text-5xl mb-3">🔒</div>

          <h2 className="text-lg font-bold text-purple-700 mb-2">
            Sign in required
          </h2>

          <p className="text-sm text-slate-700 mb-6 leading-relaxed">
            You need to be signed in to access{" "}
            <span className="font-bold text-purple-700">{featureName}</span>.
            <br />
            Sign in or create an account to continue.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <button
              onClick={handleSignIn}
              className="retro-btn retro-btn-primary px-6 py-2 text-sm"
            >
              🔑 Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="retro-btn px-6 py-2 text-sm"
            >
              📝 Sign Up
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-purple-600 hover:text-purple-800 underline"
          >
            Cancel
          </button>
        </div>

        {/* Status bar */}
        <div className="retro-statusbar">
          <span>Authentication required</span>
          <span className="ml-auto">🔒</span>
        </div>
      </div>
    </div>
  );
}