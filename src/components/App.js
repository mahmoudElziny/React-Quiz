import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      }
    case "dataFailed":
      return {
        ...state,
        status: "error",
      }
    case "start":
      return { ...state, status: "active" }
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points : state.points,
      }
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null }
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {

  const [{ questions, status, index, answer }, dispatch] = useReducer(reducer, initialState);

  const numOfQuestions = questions.length;

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
            <Question question={questions[index]} dispatch={dispatch} answer={answer} />
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>

    </div>
  );
}