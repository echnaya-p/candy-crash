import {checkCombos} from "../helpers/checkCombos";
import {useCallback, useEffect, useState, useRef} from "react";
import {generateCandies, swapColors} from "../helpers/utils";
import {updateCandies} from "../helpers/updatedCandies";
import {getCandyConfig} from "../helpers/constants";
import {playClick, playCombo, playError} from "../helpers/sounds";
import './Board.css';

const TIMER_DURATION = 30;

function Board({ isMuted, iconPack, gameMode, onExit }) {
    const candyConfig = getCandyConfig(iconPack);
    const [candies, setCandies] = useState(generateCandies());
    const [isCheck, setIsCheck] = useState(false);
    const [firstElementForSwap, setFirstElementForSwap] = useState(null);
    const [secondElementForSwap, setSecondElementForSwap] = useState(null);
    const [lastSwap, setLastSwap] = useState(null);
    const [shakeIndices, setShakeIndices] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
    const [gameOver, setGameOver] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (gameMode !== 'timed') return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setGameOver(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [gameMode, gameOver]);

    const handleCheck = useCallback(() => {
        const combo = checkCombos(candies);

        if (combo.length) {
           const showWhiteCandies = candies.map((candy, index) => combo.includes(index) ? 'white' : candy);

           setCandies(showWhiteCandies);
           setScore(prev => prev + combo.length);
           setIsCheck(true);
           setLastSwap(null);
           if (!isMuted) playCombo();
        } else if (lastSwap) {
           if (!isMuted) playError();
           setShakeIndices([lastSwap[0], lastSwap[1]]);
           setTimeout(() => {
               setCandies(swapColors(candies, lastSwap[0], lastSwap[1]));
               setShakeIndices([]);
               setLastSwap(null);
           }, 400);
        }
    }, [candies, lastSwap, isMuted]);

    const handleClick = (id) => {
        if (gameOver) return;
        if (firstElementForSwap === id) {
            setFirstElementForSwap(null);
            return;
        }
        if (!isMuted) playClick();
        if (firstElementForSwap !== null) {
            setSecondElementForSwap(id);
        } else {
            setFirstElementForSwap(id);
        }
    };

    const isSelectedItem = (id) => {
        return firstElementForSwap === id || secondElementForSwap === id;
    };

    const handleRestart = () => {
        setCandies(generateCandies());
        setScore(0);
        setTimeLeft(TIMER_DURATION);
        setGameOver(false);
        setIsCheck(false);
        setFirstElementForSwap(null);
        setSecondElementForSwap(null);
        setLastSwap(null);
        setShakeIndices([]);
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
            <div className="board-info">
                <div className="board-score">Score: {score}</div>
                {gameMode === 'timed' && (
                    <div className={`board-timer${timeLeft <= 10 ? ' warning' : ''}`}>
                        {timeLeft}s
                    </div>
                )}
            </div>
            <div className="board-grid-container">
                <div className={`board-grid${gameOver ? ' disabled' : ''}`}>
                    {candies.map((color, index) => {
                        const config = candyConfig[color] || candyConfig.white;
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
                {gameOver && (
                    <div className="game-over-overlay">
                        <div className="game-over-title">Time's up!</div>
                        <div className="game-over-score">Score: {score}</div>
                        <div className="game-over-buttons">
                            <button className="game-over-btn" onClick={handleRestart}>
                                Play Again
                            </button>
                            <button className="game-over-btn secondary" onClick={onExit}>
                                Menu
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Board;
