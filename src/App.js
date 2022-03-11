import React from "react";
import { nanoid, random } from "nanoid";
import { decode } from "html-entities";
import "./styles.css";
export default function App() {
  const [quizData, setQuizData] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const [quizEnded, setQuizEnded] = React.useState(false);
  const [selectedAnswers, setSelecetedAnswers] = React.useState([]);
  const formatData = d => decode(d);
  React.useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5")
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
  }, []);
  const selectAnswer = (id, num, answer) => {
    if (!quizEnded) {
      setSelecetedAnswers(prevSelectedAnswers => {
        prevSelectedAnswers.forEach(prevSelectedAnswer => {
          if (prevSelectedAnswer.index === num) {
            prevSelectedAnswers.map(answer => {
              return answer.index === num
                ? { ...answer, answer: answer }
                : answer;
            });
          }
        });
        return [...prevSelectedAnswers, { index: num, answer: answer }];
      });
      setQuizData(prevQuizData =>
        prevQuizData.map((item, index) => {
          if (index === num) {
            const options = item.answers.map(option => {
              let newOptions = option;
              if (option.isSelected) {
                newOptions = { ...option, isSelected: false };
              }
              if (option.id === id) {
                newOptions = { ...option, isSelected: true };
              }
              return newOptions;
            });
            return { ...item, answers: options };
          } else {
            return item;
          }
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
    setSelecetedAnswers([]);
    setScore(0);

    setQuizEnded(false);
    quizData.map(item =>
      item.answers.map(answer => ({
        ...answer,
        isSelected: false,
        isCorrect: false,
        isIncorrect: false,
      }))
    );
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
        <h2>loading...</h2>
      )}
    </div>
  );
}
