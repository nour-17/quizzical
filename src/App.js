import React from "react";
import { nanoid } from "nanoid";
import { decode } from "html-entities";
import "./styles.css";
export default function App() {
  const [quizQuestions, setQuizQuestions] = React.useState([]);
  const [selectedAnswers, setSelectedAnswers] = React.useState([]);
  const [numCorrect, setNumCorrect] = React.useState(0);
  const [initialStart, setInitialStart] = React.useState(true);
  const [customizingQuiz, setCustomizingQuiz] = React.useState(false);
  function startQuiz() {
    setInitialStart(false);
    setCustomizingQuiz(true);
  }
  console.log(numCorrect);
  const formatData = (d) => decode(d);
  React.useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5")
      .then((res) => res.json())
      .then((data) => {
        const questionData = data.results.map((item) => {
          const formattedQuestion = formatData(item.question);
          const formattedCorrectAnswer = formatData(item.correct_answer);
          const incorrectAnswers = item.incorrect_answers.map((answer) =>
            formatData(answer)
          );
          const answersOptionsArr = [];
          for (let i of incorrectAnswers) {
            answersOptionsArr.push(i);
          }
          const randomNum = Math.floor(Math.random() * 4);
          answersOptionsArr.splice(randomNum, 0, formattedCorrectAnswer);
          return {
            question: formattedQuestion,
            correct_answer: formattedCorrectAnswer,
            id: nanoid(),
            answerOptions: answersOptionsArr.map((answer) => ({
              answer: answer,
              id: nanoid(),
              isCorrect: false,
              isSelected: false,
              isIncorrect: false,
            })),
          };
        });
        setQuizQuestions(questionData);
      });
  }, []);

  function selectAnswer(id, num, answer) {
    setSelectedAnswers((prevAnswers) => {
      for (let i of prevAnswers) {
        if (i.questionIndex === num) {
          return prevAnswers.map((item) => {
            return item.questionIndex === num
              ? { ...item, answer: answer }
              : item;
          });
        }
      }
      return [...prevAnswers, { answer: answer, questionIndex: num }];
    });
    setQuizQuestions((prevQuestions) =>
      prevQuestions.map((question, index) => {
        if (index === num) {
          const newAnswerOptions = question.answerOptions.map((option) => {
            let newOption = option;
            if (option.isSelected) {
              newOption = { ...option, isSelected: false };
            }
            if (option.id === id) {
              newOption = { ...option, isSelected: true };
            }
            return newOption;
          });
          return { ...question, answerOptions: newAnswerOptions };
        } else return question;
      })
    );
  }
  function checkAnswers() {
    if (selectedAnswers.length === 5) {
      for (let i of selectedAnswers) {
        if (i.answer === quizQuestions[i.questionIndex].correct_answer) {
          setNumCorrect((prev) => prev + 1);
        }
      }
      // map throw quizQuestions array to change boolean values which will highlight correctAnwers
      setQuizQuestions((prevQuestions) =>
        prevQuestions.map((question, index) => {
          const newAnswerOptions = question.answerOptions.map((option) => {
            let newOption = option;
            if (option.answer === question.correct_answer) {
              newOption = { ...option, isCorrect: true };
            }
            if (
              option.isSelected &&
              option.answer !== question.correct_answer
            ) {
              newOption = { ...option, isIncorrect: true };
            }
            return newOption;
          });
          return { ...question, answerOptions: newAnswerOptions };
        })
      );
    }
  }
  const questionElements = quizQuestions.map((quizQuestion, questionIndex) => {
    const answerOptionElements = quizQuestion.answerOptions.map((option) => {
      let styles;
      if (option.isSelected) {
        styles = {
          backgroundColor: "rgb(51, 51, 51)",
          color: "#F5F7FB",
          border: "1px solid rgb(51, 51, 51)",
        };
      }
      if (option.isCorrect) {
        styles = {
          backgroundColor: "#94D7A2",
          border: "1px solid #94D7A2",
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
        <li
          className="option"
          style={styles}
          onClick={() => selectAnswer(option.id, questionIndex, option.answer)}
          key={option.id}
        >
          {option.answer}
        </li>
      );
    });
    return (
      <div className="quiz-question" key={quizQuestion.id}>
        <h3 className="quiz-question__question">{quizQuestion.question}</h3>
        <ul className="quiz-question__options">{answerOptionElements}</ul>
      </div>
    );
  });
  return (
    <div>
      {quizQuestions.length ? (
        <div className="questionare">
          {questionElements}
          <p className="score">You scored {numCorrect}/5 correct answers</p>
          <button className="play-again-btn" onClick={checkAnswers}>
            Play again
          </button>
        </div>
      ) : (
        <h3>loading...</h3>
      )}
    </div>
  );
}
