import React from "react";
import { nanoid, random } from "nanoid";
import { decode } from "html-entities";
import "./styles.css";
export default function App() {
  const [quizQuestions, setQuizQuestions] = React.useState([]);
  const [quizEnded, setQuizEnded] = React.useState(false);
  const [selecetedAnswers, setSelectedAnswers] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const formatData = (d) => decode(d);
  React.useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5")
      .then((res) => res.json())
      .then((data) => {
        const questionsData = data.results.map((result) => {
          const formattedQuestion = formatData(result.question);
          const formattedCorrectAnswer = formatData(result.correct_answer);
          const formmattedIncorrectAnswers = result.incorrect_answers.map(
            (ans) => formatData(ans)
          );
          const options = [];
          formmattedIncorrectAnswers.forEach((ans) => options.push(ans));
          const randomNum = Math.floor(Math.random() * 4);
          options.splice(randomNum, 0, formattedCorrectAnswer);
          return {
            question: formattedQuestion,
            id: nanoid(),
            correct_answer: formattedCorrectAnswer,
            options: options.map((option) => ({
              answer: option,
              id: nanoid(),
              isSelected: false,
              isCorrect: false,
              isIncorrect: false,
            })),
          };
        });
        setQuizQuestions(questionsData);
      });
  }, []);

  function selectAnswer(id, num, answer) {
    if (!quizEnded) {
      setSelectedAnswers((prevAnswers) => {
        prevAnswers.forEach((prevAnswer) => {
          if (prevAnswer.index === num) {
            return prevAnswers.map((ans) => {
              return ans.index === num ? { ...ans, answer: answer } : ans;
            });
          }
        });
        return [...prevAnswers, { index: num, answer: answer }];
      });
      setQuizQuestions((prevQuizQuestions) => {
        return prevQuizQuestions.map((question, index) => {
          if (index === num) {
            const newAnswerOptions = question.options.map((option) => {
              let newOptions = option;
              if (option.isSelected) {
                newOptions = { ...option, isSelected: false };
              }
              if (option.id === id) {
                newOptions = { ...option, isSelected: true };
              }
              return newOptions;
            });
            return { ...question, options: newAnswerOptions };
          } else return question;
        });
      });
    }
  }
  function checkAnswer() {
    if (selecetedAnswers.length === 5) {
      selecetedAnswers.forEach((answer) => {
        if (answer.answer === quizQuestions[answer.index].correct_answer) {
          setScore((prevScore) => prevScore + 1);
        }
      });
    }
    setQuizQuestions((prevQuestions) =>
      prevQuestions.map((question, index) => {
        const newAnswerOptions = question.options.map((option) => {
          let newOption = option;
          if (option.answer === question.correct_answer) {
            newOption = { ...option, isCorrect: true };
          }
          if (option.isSelected && option.answer !== question.correct_answer) {
            newOption = { ...option, isIncorrect: true };
          }
          return newOption;
        });
        return { ...question, options: newAnswerOptions };
      })
    );

    setQuizEnded(true);
  }

  const questionsElements = quizQuestions.map((question, questionIndex) => {
    const answerOptionElements = question.options.map((option) => {
      let styles;
      if (option.isSelected) {
        styles = {
          backgroundColor: "#D6DBF5",
          color: "red",
          border: "5px solid red",
        };
      }
      if (option.isIncorrect) {
        styles = {
          backgroundColor: "#cf9d9d",
          color: "#545e94",
          border: "1px solid #cf9d9d",
        };
      }
      if (!option.isCorrect && !option.isIncorrect) {
        styles = {
          color: "#8f96bd",
          border: "1px solid #8f96bd",
        };
      }
      return (
        <button
          style={styles}
          onClick={() => selectAnswer(option.id, questionIndex, option.answer)}
        >
          {option.answer}
        </button>
      );
    });
    return (
      <div className="questionare" key={question.id}>
        <h3>{question.question}</h3>
        <div>{answerOptionElements}</div>
      </div>
    );
  });
  return (
    <div>
      {quizQuestions.length ? (
        <div>
          {questionsElements}
          <button onClick={checkAnswer}>check answer</button>
        </div>
      ) : (
        <h3>loading...</h3>
      )}
    </div>
  );
}
