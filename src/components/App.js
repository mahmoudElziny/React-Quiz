import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return { ...state, status: "finished", highscore: state.points > state.highscore ? state.points : state.highscore };  
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {

  const [{ questions, status, index, answer, points, highscore }, dispatch] = useReducer(reducer, initialState);

  const numOfQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  async function fetchingData() {
    try {
      const res = await fetch("http://localhost:8000/questions");
      const data = await res.json();
      dispatch({ type: 'dataReceived', payload: data });
    } catch (err) {
      dispatch({ type: 'dataFailed' });
    }
  }

  useEffect(function () {
    fetchingData();
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen numOfQuestions={numOfQuestions} dispatch={dispatch} />}
        {status === "active" && (
          <>
            <Progress index={index} numOfQuestions={numOfQuestions} points={points} maxPossiblePoints={maxPossiblePoints} answer={answer} />
            <Question question={questions[index]} dispatch={dispatch} answer={answer} />
            <NextButton dispatch={dispatch} answer={answer} index={index} numOfQuestions={numOfQuestions} />
          </>
        )}
      {status === "finished" && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highscore={highscore}/>}
      </Main>

    </div>
  );
}