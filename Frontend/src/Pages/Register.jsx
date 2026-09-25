import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      login(data.user, data.token);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen retro-bg flex items-center justify-center p-4">
      <div className="sparkles-layer" aria-hidden="true" />

      <div className="relative z-10 retro-window max-w-md w-full">
        <div className="retro-window-titlebar">
          <div className="retro-window-dots">
            <span className="retro-dot retro-dot-red" />
            <span className="retro-dot retro-dot-yellow" />
            <span className="retro-dot retro-dot-green" />
          </div>
          <span className="retro-window-title">MOODWAVE — REGISTER</span>
          <div className="retro-window-controls">
            <button
              className="retro-ctrl-btn retro-ctrl-close"
              onClick={() => navigate("/")}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="retro-window-content">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">📝</div>
            <h1 className="text-xl font-bold text-purple-700">
              Create Account
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Sign up to unlock Dashboard and Models
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-xs font-bold text-purple-700 block mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border-2 border-slate-900 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-purple-600"
                placeholder="Your name"
              />
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-purple-700 block mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-2 border-slate-900 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-purple-600"
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-purple-700 block mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border-2 border-slate-900 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-purple-600"
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="retro-btn retro-btn-primary w-full py-2 mb-3 disabled:opacity-50"
            >
              {loading ? "Creating..." : "📝 Create Account"}
            </button>
          </form>

          <div className="text-center text-xs">
            <span className="text-slate-600">Already have one? </span>
            <Link
              to="/login"
              className="text-purple-700 font-bold hover:underline"
            >
              Sign In →
            </Link>
          </div>
        </div>

        <div className="retro-statusbar">
          <span>Create your account</span>
          <span className="ml-auto">📝</span>
        </div>
      </div>
    </div>
  );
}