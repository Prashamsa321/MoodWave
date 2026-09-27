import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Win98Dialog from "../components/Win98Dialog";
import Win98Icon from "../components/Win98Icon";

function getRegisterErrorMessage(err) {
  const serverMessage = err.response?.data?.message;
  if (serverMessage) return serverMessage;

  if (!err.response) {
    return "Cannot reach the MoodWave backend. Check that the backend is running on port 5001.";
  }

  if (err.response.status === 403) {
    return "Registration request was rejected (HTTP 403). Another service may be using the API port.";
  }

  return `Registration failed (HTTP ${err.response.status}).`;
}

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

      try {
        login(data.user, data.token);
      } catch (sessionErr) {
        console.error("REGISTER SESSION ERROR:", sessionErr);
        toast.error("Account was created, but the local login session could not be saved.");
        return;
      }

      toast.success("Account created successfully.");
      navigate("/");
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      console.error("REGISTER RESPONSE:", err.response);
      console.error("REGISTER DATA:", err.response?.data);
      toast.error(getRegisterErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="win98-auth-desktop">
      <Win98Dialog
        title="Create MoodWave Account"
        icon="▣"
        onClose={() => navigate("/")}
        className="win98-auth-dialog win98-register-dialog"
      >
        <form onSubmit={handleSubmit} className="win98-auth-form">
          <div className="win98-auth-intro">
            <Win98Icon type="user" size={48} />
            <p>Enter your details below. Your password must contain at least 6 characters.</p>
          </div>

          <div className="win98-form-grid">
            <label htmlFor="register-name">Name:</label>
            <input
              id="register-name"
              className="win98-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />

            <label htmlFor="register-email">E-mail:</label>
            <input
              id="register-email"
              className="win98-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="register-password">Password:</label>
            <input
              id="register-password"
              className="win98-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="win98-auth-links">
            <span>Already registered?</span>
            <Link to="/login">Log on instead</Link>
          </div>

          <div className="win98-dialog-button-row">
            <button type="submit" disabled={loading} className="retro-btn win98-default-button">
              {loading ? "Creating..." : "Create"}
            </button>
            <button type="button" className="retro-btn" onClick={() => navigate("/")}>Cancel</button>
          </div>
        </form>
      </Win98Dialog>

      <div className="win98-auth-caption">MoodWave account setup</div>
    </div>
  );
}
