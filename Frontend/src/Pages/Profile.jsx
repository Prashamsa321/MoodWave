import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RetroWindow from "../components/RetroWindow";
import Win98Icon from "../components/Win98Icon";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Profile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

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
      login(data.user, localStorage.getItem("token"));
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <RetroWindow title="User Properties" appIcon="U">
        <div className="win98-app-page">
          <div className="win98-message-box is-error">
            <span className="win98-message-icon">!</span>
            <span>You must be signed in to view this page.</span>
          </div>
          <div className="win98-action-row">
            <Link to="/login" className="retro-btn win98-default-button">Log On...</Link>
          </div>
        </div>
      </RetroWindow>
    );
  }

  return (
    <RetroWindow title="User Properties" appIcon="U" statusText={`Logged on as ${user.email}`}>
      <div className="win98-app-page win98-profile-page">
        <div className="win98-property-tabs" role="tablist" aria-label="Profile sections">
          <button type="button" className="win98-tab is-active">General</button>
          <button type="button" className="win98-tab" onClick={() => navigate("/history")}>History</button>
        </div>

        <div className="win98-property-sheet">
          <div className="win98-profile-summary">
            <div className="win98-profile-avatar" aria-label={`${initials} avatar`}>
              <Win98Icon type="user" size={54} />
            </div>
            <div className="win98-profile-identity">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
              <span className="win98-muted">MoodWave user account</span>
            </div>
          </div>

          <div className="win98-rule" />

          <fieldset className="win98-groupbox">
            <legend>User information</legend>
            <div className="win98-form-grid win98-profile-form-grid">
              <label htmlFor="profile-name">Display name:</label>
              <input
                id="profile-name"
                type="text"
                className="win98-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label htmlFor="profile-email">E-mail address:</label>
              <div>
                <input
                  id="profile-email"
                  type="email"
                  className="win98-input"
                  value={user.email}
                  disabled
                />
                <div className="win98-field-help">This value is managed by your account and cannot be changed here.</div>
              </div>
            </div>
          </fieldset>

          <fieldset className="win98-groupbox">
            <legend>Prediction history</legend>
            <div className="win98-info-row">
              <Win98Icon type="history" size={34} />
              <div>
                <p>View saved results from the MoodWave models.</p>
                <button type="button" className="retro-btn" onClick={() => navigate("/history")}>View History...</button>
              </div>
            </div>
          </fieldset>

          <div className="win98-dialog-button-row win98-profile-buttons">
            <button type="button" onClick={handleSave} disabled={loading} className="retro-btn win98-default-button">
              {loading ? "Saving..." : "OK"}
            </button>
            <button type="button" className="retro-btn" onClick={() => setName(user.name)}>Cancel</button>
            <button type="button" className="retro-btn" onClick={handleSave} disabled={loading}>Apply</button>
          </div>
        </div>
      </div>
    </RetroWindow>
  );
}
