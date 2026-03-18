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

    const handleCheck = useCallback(() => {
        const combo = checkCombos(candies);

        if (combo.length) {
           const showWhiteCandies = candies.map((candy, index) => combo.includes(index) ? 'white' : candy);

           setCandies(showWhiteCandies);
           setIsCheck(true);
        }
    }, [candies]);

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
            setIsCheck(true);
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
            <div className="board-grid">
                {candies.map((color, index) => {
                    const config = CANDY_CONFIG[color] || CANDY_CONFIG.white;
                    const isEmpty = color === 'white';

                    return (
                        <div
                            key={index}
                            className={`candy-cell${isSelectedItem(index) ? ' selected' : ''}${isEmpty ? ' empty' : ''}`}
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
