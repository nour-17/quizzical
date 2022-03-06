import React from "react";

const Questionare = ({
  handleAnswer,
  data: { question, correct_answer, incorrect_answers },
}) => {
  const shuffledAnswer = [correct_answer, ...incorrect_answers].sort(
    () => Math.random() - 0.5
  );
  return (
    <div className="questionare">
      <h2 dangerouslySetInnerHTML={{ __html: question }}></h2>
      {shuffledAnswer.map((ans) => (
        <button
          className={correct_answer === ans ? "right" : "wrong"}
          onClick={() => handleAnswer(ans, correct_answer)}
          answer={ans}
          dangerouslySetInnerHTML={{ __html: ans }}
          key={ans}
        ></button>
      ))}
    </div>
  );
};

export default Questionare;
