import React from "react";

export default function Intro({ startQuiz }) {
  return (
    <div className="intro">
      <h1 className="intro__title">Quizzical</h1>
      <p>test your general knowledge around a variety of subjects.</p>
      <button className="submit intro-btn" onClick={startQuiz}>
        Start
      </button>
    </div>
  );
}
