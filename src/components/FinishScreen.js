import React from 'react'

export default function FinishScreen({ points, maxPossiblePoints, highscore, dispatch }) {

    const percentage = (points / maxPossiblePoints) * 100;

    let emoji;
    if (percentage === 100) emoji = "🥇";
    else if (percentage >= 80) emoji = "🎉";
    else if (percentage >= 50) emoji = "👍";
    else if (percentage >= 30) emoji = "🤨";
    else emoji = "🤯"

    return (
        <>
            <p className='result'>
                <span>{emoji}</span> You Scored <strong>{points}</strong> out of {maxPossiblePoints} ({Math.ceil(percentage)}%)
            </p>
            <p className='highscore'>(HighScore: {highscore} points)</p>
            <button className='btn btn-ui' onClick={() => dispatch({ type: "restart" })}>Restart Quiz</button>
        </>
    )
}
