import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";

const initialState = {
  questions: [],
  status: "loading",
};
function reducer(state, action){
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
        default:
          throw new Error("Unknown action");  
    }
}

export default function App() {

  const [state, dispatch] = useReducer(reducer, initialState);

  async function fetchingData() {
    try {
      const res = await fetch("http://localhost:8000/questions");
      const data = await res.json();
      dispatch({type: 'dataReceived', payload: data});
    } catch(err) {
      dispatch({type: 'dataFailed'});
    }
  }

  useEffect(function () {
    fetchingData();
  }, []);

  return (
    <div className="app">
      <Header/>

      <Main>
        <p>1/15</p>
        <p>Question?</p>
      </Main>
    </div>
  );
}