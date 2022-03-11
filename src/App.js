import React from "react";
import { nanoid, random } from "nanoid";
import { decode } from "html-entities";
import "./styles.css";
export default function App() {
  const [quizData, setQuizData] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const [quizEnded, setQuizEnded] = React.useState(false);
  const [apiUrl, setApiUrl] = React.useState("");
  const [selectedAnswers, setSelecetedAnswers] = React.useState([]);
  const formatData = d => decode(d);
  console.log(selectedAnswers);
  React.useEffect(() => {
    setApiUrl(
      "https://opentdb.com/api.php?amount=5&category=21&difficulty=easy"
    );
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const quizQuestionData = data.results.map(result => {
          const quizQuestion = formatData(result.question);
          const quizCorrectAnswer = formatData(result.correct_answer);
          const quizIncorrectAnswers = result.incorrect_answers.map(
            incorrectAnswer => formatData(incorrectAnswer)
          );
          const quizAnswersArr = [];
          quizIncorrectAnswers.forEach(incorrectAnswer => {
            quizAnswersArr.push(incorrectAnswer);
          });
          const randomNum = Math.floor(Math.random() * 4);
          quizAnswersArr.splice(randomNum, 0, quizCorrectAnswer);
          return {
            id: nanoid(),
            question: quizQuestion,
            correctAnswer: quizCorrectAnswer,
            answers: quizAnswersArr.map(answer => {
              return {
                answer: answer,
                isSelected: false,
                isCorrect: false,
                isIncorrect: false,
                id: nanoid(),
              };
            }),
          };
        });
        setQuizData(quizQuestionData);
      });
  }, [apiUrl]);
  const selectAnswer = (id, num, answer) => {
    if (!quizEnded) {
      setSelecetedAnswers(prevSelectedAnswers => {
        {
          for (let selectedAnswer of prevSelectedAnswers) {
            if (selectedAnswer.index === num) {
              return prevSelectedAnswers.map(item => {
                return item.index === num ? { ...item, answer: answer } : item;
              });
            }
          }
        }
        return [...prevSelectedAnswers, { answer: answer, index: num }];
      });
      setQuizData(prevQuizData =>
        prevQuizData.map((question, index) => {
          if (index === num) {
            const newAnswerOptions = question.answers.map(option => {
              let newOption = option;
              if (option.isSelected) {
                newOption = { ...option, isSelected: false };
              }
              if (option.id === id) {
                newOption = { ...option, isSelected: true };
              }
              return newOption;
            });
            return { ...question, answers: newAnswerOptions };
          } else return question;
        })
      );
    }
  };
  const checkAnswer = () => {
    if (selectedAnswers.length === 5) {
      selectedAnswers.forEach(selectedAnswer => {
        if (
          selectedAnswer.answer === quizData[selectedAnswer.index].correctAnswer
        ) {
          setScore(prevScore => prevScore + 1);
        }
        setQuizData(prevQuizData =>
          prevQuizData.map(item => {
            const newOptions = item.answers.map(option => {
              let newOption = option;
              if (option.answer === item.correctAnswer) {
                newOption = { ...option, isCorrect: true };
              }
              if (option.isSelected && option.answer !== item.correctAnswer) {
                newOption = { ...option, isIncorrect: true };
              }
              return newOption;
            });
            return { ...item, answers: newOptions };
          })
        );
        setQuizEnded(true);
      });
    }
  };
  const playAgain = () => {
    setApiUrl("");
    setQuizData([]);
    setSelecetedAnswers([]);
    setScore(0);

    setQuizEnded(false);
  };
  const quizElements = quizData.map((question, questionIndex) => {
    const answerOptionsElements = question.answers.map(option => {
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
      if (quizEnded && !option.isCorrect && !option.isIncorrect) {
        styles = {
          color: "#8f96bd",
          border: "1px solid #8f96bd",
        };
      }
      return (
        <button
          style={styles}
          className="option"
          onClick={() => selectAnswer(option.id, questionIndex, option.answer)}
        >
          {option.answer}
        </button>
      );
    });
    return (
      <div className="questionare" key={question.id}>
        <h3 className="quiz-question__question">{question.question}</h3>
        <div className="quiz-question__options">{answerOptionsElements}</div>
      </div>
    );
  });
  return (
    <div>
      {quizData.length ? (
        <div>
          {quizElements}

          <div>
            {!quizEnded ? (
              <button onClick={checkAnswer}>check Answer</button>
            ) : (
              <div>
                <p>YOU GOT {score}/5</p>
                <button onClick={playAgain}>PLAY AGAIN</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <h2>hey bro were loading...</h2>
      )}
    </div>
  );
}
