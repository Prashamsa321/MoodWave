import { useNavigate } from "react-router-dom";
import Win98Dialog from "./Win98Dialog";
import Win98Icon from "./Win98Icon";

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
    <div className="win98-modal-overlay" onMouseDown={onClose}>
      <div onMouseDown={(event) => event.stopPropagation()}>
        <Win98Dialog title="MoodWave" icon="!" onClose={onClose} className="win98-message-dialog">
          <div className="win98-modal-message">
            <Win98Icon type="warning" size={42} />
            <div>
              <p><strong>Log on required.</strong></p>
              <p>You must be signed in to open <b>{featureName}</b>.</p>
            </div>
          </div>
          <div className="win98-dialog-button-row">
            <button type="button" className="retro-btn win98-default-button" onClick={handleSignIn}>Log On...</button>
            <button type="button" className="retro-btn" onClick={handleSignUp}>Create Account...</button>
            <button type="button" className="retro-btn" onClick={onClose}>Cancel</button>
          </div>
        </Win98Dialog>
      </div>
    </div>
  );
}
