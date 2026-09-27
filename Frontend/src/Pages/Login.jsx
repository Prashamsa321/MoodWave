import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Win98Dialog from "../components/Win98Dialog";
import Win98Icon from "../components/Win98Icon";

function getLoginErrorMessage(err) {
  const serverMessage = err.response?.data?.message;
  if (serverMessage) return serverMessage;

  if (!err.response) {
    return "Cannot reach the MoodWave backend. Check that the backend is running on port 5001.";
  }

  if (err.response.status === 403) {
    return "Login request was rejected (HTTP 403). Another service may be using the API port.";
  }

  return `Login failed (HTTP ${err.response.status}).`;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });

      try {
        login(data.user, data.token);
      } catch (sessionErr) {
        console.error("LOGIN SESSION ERROR:", sessionErr);
        toast.error("Login succeeded, but the local session could not be saved.");
        return;
      }

      toast.success("Signed in successfully.");
      navigate("/");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      console.error("LOGIN RESPONSE:", err.response);
      console.error("LOGIN DATA:", err.response?.data);
      toast.error(getLoginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="win98-auth-desktop">
      <Win98Dialog
        title="Log On to MoodWave"
        icon="▣"
        onClose={() => navigate("/")}
        className="win98-auth-dialog"
      >
        <form onSubmit={handleSubmit} className="win98-auth-form">
          <div className="win98-auth-intro">
            <Win98Icon type="key" size={48} />
            <p>Type your account information to log on to MoodWave.</p>
          </div>

          <div className="win98-form-grid">
            <label htmlFor="login-email">E-mail:</label>
            <input
              id="login-email"
              className="win98-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="login-password">Password:</label>
            <input
              id="login-password"
              className="win98-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="win98-auth-links">
            <span>New to MoodWave?</span>
            <Link to="/register">Create an account</Link>
          </div>

          <div className="win98-dialog-button-row">
            <button type="submit" disabled={loading} className="retro-btn win98-default-button">
              {loading ? "Logging on..." : "OK"}
            </button>
            <button type="button" className="retro-btn" onClick={() => navigate("/")}>Cancel</button>
          </div>
        </form>
      </Win98Dialog>

      <div className="win98-auth-caption">Microsoft Windows 98 style interface · MoodWave</div>
    </div>
  );
}
