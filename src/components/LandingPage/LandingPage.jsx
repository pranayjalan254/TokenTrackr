import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-container">
      <div className="content">
        <h1 className="title">TokenTrackr</h1>
        <p className="subtitle">
          Monitor, track, and manage your tokens effortlessly.
        </p>
        <button className="get-started-btn" onClick={() => navigate("/login")}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
