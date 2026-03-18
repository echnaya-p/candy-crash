import {checkCombos} from "../helpers/checkCombos";
import {useCallback, useEffect, useState} from "react";
import {generateCandies, swapColors} from "../helpers/utils";
import {updateCandies} from "../helpers/updatedCandies";
import {CANDY_CONFIG} from "../helpers/constants";
import './Board.css';

function Board() {
    const [candies, setCandies] = useState(generateCandies());
    const [isCheck, setIsCheck] = useState(false);
    const [firstElementForSwap, setFirstElementForSwap] = useState(null);
    const [secondElementForSwap, setSecondElementForSwap] = useState(null);
    const [lastSwap, setLastSwap] = useState(null);
    const [shakeIndices, setShakeIndices] = useState([]);
    const [score, setScore] = useState(0);

    const handleCheck = useCallback(() => {
        const combo = checkCombos(candies);

        if (combo.length) {
           const showWhiteCandies = candies.map((candy, index) => combo.includes(index) ? 'white' : candy);

           setCandies(showWhiteCandies);
           setScore(prev => prev + combo.length);
           setIsCheck(true);
           setLastSwap(null);
        } else if (lastSwap) {
           setShakeIndices([lastSwap[0], lastSwap[1]]);
           setTimeout(() => {
               setCandies(swapColors(candies, lastSwap[0], lastSwap[1]));
               setShakeIndices([]);
               setLastSwap(null);
           }, 400);
        }
    }, [candies, lastSwap]);

    const handleClick = (id) => {
        if (firstElementForSwap !== null) {
            setSecondElementForSwap(id);
        } else {
            setFirstElementForSwap(id);
        }
    };

    const isSelectedItem = (id) => {
        return firstElementForSwap === id || secondElementForSwap === id;
    };

    useEffect(() => {
        if (firstElementForSwap !== null && secondElementForSwap !== null) {
            const updatedCandies = swapColors(candies, firstElementForSwap, secondElementForSwap);
            setCandies(updatedCandies);
            setLastSwap([firstElementForSwap, secondElementForSwap]);
            setFirstElementForSwap(null);
            setSecondElementForSwap(null);
        }
    }, [candies, firstElementForSwap, secondElementForSwap]);

    useEffect(() => {
        if (isCheck) return;

        const timer = setTimeout(() => handleCheck(), 300);

        return () => clearTimeout(timer);
    }, [isCheck, handleCheck]);

    useEffect(() => {
        if (!isCheck) return;

        const timer = setTimeout(() => {
            const newCandies = updateCandies(candies);

            setCandies(newCandies);
            setIsCheck(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [candies, isCheck]);

    return (
        <div className="board-wrapper">
            <div className="board-title">Candy Crash</div>
            <div className="board-score">Score: {score}</div>
            <div className="board-grid">
                {candies.map((color, index) => {
                    const config = CANDY_CONFIG[color] || CANDY_CONFIG.white;
                    const isEmpty = color === 'white';

                    return (
                        <div
                            key={index}
                            className={`candy-cell${isSelectedItem(index) ? ' selected' : ''}${isEmpty ? ' empty' : ''}${shakeIndices.includes(index) ? ' shake' : ''}`}
                            style={{background: config.bg}}
                            onClick={() => handleClick(index)}
                        >
                            {config.emoji}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Board;
