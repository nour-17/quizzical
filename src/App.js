import React from "react";
import Customize from "./components/Customize";
import Confetti from 'react-confetti'
import Intro from "./components/Intro";
import { nanoid, random } from "nanoid";
import { decode } from "html-entities";
import "./styles.css";
export default function App() {
  const [quizData, setQuizData] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const [initialStart,setInitialStart] = React.useState(true)
  const [customizingQuiz, setCustomizingQuiz] = React.useState(false)
  const [quizEnded, setQuizEnded] = React.useState(false);
  const [apiUrl, setApiUrl] = React.useState("");
  const [selectedAnswers, setSelecetedAnswers] = React.useState([]);
  const [loading, setLoading] = React.useState(false)
  const [buttonStyle, setButtonStyle] = React.useState({})
  const [gameWon, setGameWon] = React.useState(false)

  const startQuiz = ()=>{
    setInitialStart(false)
    setCustomizingQuiz(true)
  }
  const formatData = d => decode(d);
  const generateApi =(data)=>{
    if(data.difficulty){
      let url =`https://opentdb.com/api.php?amount=5&category=${data.category}&difficulty=${data.difficulty}`
      setApiUrl(url)
      setCustomizingQuiz(false)
    }else{
      setButtonStyle({
        animation:"wiggle 500ms"
      })
      setTimeout(()=> setButtonStyle({}),500)
    }
  }
  React.useEffect(()=>{
    if(score===5){
      setGameWon(true)
    }
  },[quizEnded])
  React.useEffect(() => {
    setLoading(true)
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
      })
      .catch(err => console.log(err))
      .finally(()=> setLoading(false))
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
      } )
    }else {
      setButtonStyle({ /* Wiggle check answers button if clicked before all selections made */
        animation: "wiggle 500ms"
      })
      setTimeout(() => setButtonStyle({}), 500)
    }
  };
  const playAgain = () => {
    setSelecetedAnswers([])
    setScore(0)
    setQuizEnded(false)
    setApiUrl("")
    setCustomizingQuiz(true)
    setQuizEnded(false);
    setButtonStyle({})
    setGameWon(false)
  };
  const quizElements = quizData.map((question, questionIndex) => {
    const answerOptionsElements = question.answers.map(option => {
      let styles;
      if(option.isSelected){
        styles = "selected"
      }
      if(option.isCorrect){
        styles = "right"
    
      }
      if(option.isIncorrect){
        styles = "wrong"
      }
      if(quizEnded && !option.isCorrect &&!option.isIncorrect){
        styles = "nothing"
      }return (
        <button
        key={option.id}
          className={`option ${styles}`}
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
  if (loading) {
    return (<div className='app'>
              <div className='loading-spinner'></div>
            </div>)
  }
  return (
    <div className="app">
      {gameWon && <Confetti />}
      {initialStart ? <Intro startQuiz={startQuiz} />:
      
      customizingQuiz && <Customize generate={generateApi} buttonStyle={buttonStyle} />}{!initialStart && !customizingQuiz && (
        <div className="container">
          {quizElements}

          <div className="btn-score">
            
            {!quizEnded ? (
              <button style={buttonStyle} className="submit" onClick={checkAnswer}>check Answer</button>
            ) : (
              <div className="btn-score">
                <h3 className="score">You scored <span>{score}</span>/5 correct answers</h3>
                <button className="submit play-again-btn" onClick={playAgain}>PLAY AGAIN</button>
              </div>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
}