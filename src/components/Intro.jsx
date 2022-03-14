import React from "react";

export default function Intro({ startQuiz }) {
  return (
    <div className="intro">
      <h1 className="intro__title">Quizzical</h1>
      <p>How much do you know?</p>
      <button className="submit intro-btn" onClick={startQuiz}>
        Start
      </button>
    </div>
  );
}
