import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RetroWindow from "../components/RetroWindow";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Profile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  // Initials for avatar
  const initials = (user?.name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (name === user.name) {
      toast.info("Nothing changed");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.put("/user/update", { name });
      // Update local auth state with new user
      login(data.user, localStorage.getItem("token"));
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    // Should never happen because of route guard, but safe fallback
    return (
      <RetroWindow title="MY PROFILE">
        <div className="text-center py-8">
          <p className="text-purple-700">You must be signed in.</p>
          <Link to="/login" className="retro-btn retro-btn-primary inline-block mt-4 px-4 py-2">
            Sign In
          </Link>
        </div>
      </RetroWindow>
    );
  }

  return (
    <RetroWindow title="MY PROFILE">
      <h1 className="retro-h1">👤 My Profile</h1>
      <p className="text-sm text-purple-700 mb-6">
        Manage your account details.
      </p>

      {/* Profile header card */}
      <div className="bg-white border-2 border-slate-900 rounded-lg p-5 mb-6 flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full border-2 border-slate-900 flex items-center justify-center text-white font-bold text-2xl shrink-0"
          style={{
            background: "linear-gradient(135deg, #7c5cbf, #9a7ee0)",
          }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <div className="text-lg font-bold text-purple-700 truncate">
            {user.name}
          </div>
          <div className="text-xs text-slate-600 truncate">{user.email}</div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white border-2 border-slate-900 rounded-lg p-5 mb-6">
        <h2 className="text-sm font-bold text-purple-700 mb-4">
          Edit Profile
        </h2>

        <div className="mb-4">
          <label className="text-xs font-bold text-purple-700 block mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-2 border-slate-900 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-purple-600"
          />
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold text-purple-700 block mb-1 flex items-center gap-2">
            Email
            <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded">
              🔒 Cannot be changed
            </span>
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full border-2 border-slate-300 rounded px-3 py-2 text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="retro-btn retro-btn-primary px-6 py-2 disabled:opacity-50"
        >
          {loading ? "Saving..." : "💾 Save Changes"}
        </button>
      </div>

      {/* History link */}
      <div className="bg-white border-2 border-slate-900 rounded-lg p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-sm font-bold text-purple-700 mb-1">
              📜 Prediction History
            </h2>
            <p className="text-xs text-slate-600">
              View all your past predictions and search history.
            </p>
          </div>
          <button
            onClick={() => navigate("/history")}
            className="retro-btn px-5 py-2"
          >
            View History →
          </button>
        </div>
      </div>
    </RetroWindow>
  );
}