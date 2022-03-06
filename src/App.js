import React from "react";
import Questionare from "./components/questionare";
import "./styles.css";
const App = () => {
  const apiKey = "https://opentdb.com/api.php?amount=5";

  const [questions, setQuestions] = React.useState([]);

  React.useEffect(() => {
    fetch(apiKey)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.results);
      });
  }, []);
  const handleAnswer = (answer, correctAnswer) => {
    answer === correctAnswer ? console.log("right") : console.log("wrong");
  };
  const allQuestions = questions.map((one) => {
    return (
      <Questionare key={one.question} handleAnswer={handleAnswer} data={one} />
    );
  });
  //   returning the component
  return questions.length ? (
    <div className="container">{allQuestions}</div>
  ) : (
    <h2>loading</h2>
  );
};
export default App;
