import React from "react";

const Questionare = ({ data: { question, correct_answer, answerOptions } }) => {
  return (
    <div className="questionare">
      <h2> {question}</h2>
      {answerOptions.map((ans) => (
        <button>{ans}</button>
      ))}
    </div>
  );
};

export default Questionare;
