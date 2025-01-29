import { useReducer } from "react";


const initialState = {count: 0, step: 1};

function reducer(state, action) {
    switch (action.type) {
        case "inc":
            return {count: state.count + state.step, step: state.step};
        case "dec":
            return {count: state.count - state.step, step: state.step};
        case "setCount":
            return {count: action.payload, step: state.step};
        case "setStep":
            return {count: state.count, step: action.payload};
        case "reset":
            return initialState;    
        default:
            throw new Error("Unknown action");
    }
}

function DateCounter() {

    const [state, dispatch] = useReducer(reducer, initialState);
    const {count, step} = state;
    // const [step, setStep] = useState(1);

    // This mutates the date object.
    const date = new Date("june 21 2027");
    date.setDate(date.getDate() + count);

    const dec = function () {
        dispatch({type: "dec"});
    };

    const inc = function () {
        dispatch({type: "inc"});
    };

    const defineCount = function (e) {
        dispatch({type: "setCount", payload: Number(e.target.value)});
    };

    const defineStep = function (e) {
        dispatch({type: "setStep", payload: Number(e.target.value)});
    };

    const reset = function () {
        dispatch({type: "reset"});
    };

    return (
        <div className="counter">
            <div>
                <input
                    type="range"
                    min="0"
                    max="10"
                    value={step}
                    onChange={defineStep}
                />
                <span>{step}</span>
            </div>

            <div>
                <button onClick={dec}>-</button>
                <input value={count} onChange={defineCount} />
                <button onClick={inc}>+</button>
            </div>

            <p>{date.toDateString()}</p>

            <div>
                <button onClick={reset}>Reset</button>
            </div>
        </div>
    );
}
export default DateCounter;