import React from "react";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="overlay">
        <div className="content">
          <h1 className="title">TokenTrackr</h1>
          <p className="subtitle">
            Monitor, track, and manage your tokens effortlessly.
          </p>
          <button className="get-started-btn">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
