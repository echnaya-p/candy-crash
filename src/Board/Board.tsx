import { checkCombos } from "../helpers/checkCombos";
import { useCallback, useEffect, useState, useRef } from "react";
import { generateCandies, swapColors } from "../helpers/utils";
import { updateCandies } from "../helpers/updatedCandies";
import { getCandyConfig } from "../helpers/constants";
import { playClick, playCombo, playError } from "../helpers/sounds";
import { t } from "../helpers/i18n";
import { BoardProps, BoardState } from "../types";
import './Board.css';

const TIMER_DURATION = 30;

function Board({ isMuted, iconPack, gameMode, lang, onExit }: BoardProps) {
    const candyConfig = getCandyConfig(iconPack);
    const [candies, setCandies] = useState<BoardState>(generateCandies());
    const [isCheck, setIsCheck] = useState(false);
    const [firstElementForSwap, setFirstElementForSwap] = useState<number | null>(null);
    const [secondElementForSwap, setSecondElementForSwap] = useState<number | null>(null);
    const [lastSwap, setLastSwap] = useState<[number, number] | null>(null);
    const [shakeIndices, setShakeIndices] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
    const [gameOver, setGameOver] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (gameMode !== 'timed') return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    setGameOver(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameMode, gameOver]);

    const handleCheck = useCallback(() => {
        const combo = checkCombos(candies);

        if (combo.length) {
           const showWhiteCandies: BoardState = candies.map((candy, index) => combo.includes(index) ? 'white' : candy);

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

    const handleClick = (id: number): void => {
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

    const isSelectedItem = (id: number): boolean => {
        return firstElementForSwap === id || secondElementForSwap === id;
    };

    const handleRestart = (): void => {
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
            <div className="board-title">{t(lang, 'title')}</div>
            <div className="board-info">
                <button className="board-back" onClick={onExit}>←</button>
                <div className="board-score">{t(lang, 'score')}: {score}</div>
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
                        <div className="game-over-title">{t(lang, 'timesUp')}</div>
                        <div className="game-over-score">{t(lang, 'score')}: {score}</div>
                        <div className="game-over-buttons">
                            <button className="game-over-btn" onClick={handleRestart}>
                                {t(lang, 'playAgain')}
                            </button>
                            <button className="game-over-btn secondary" onClick={onExit}>
                                {t(lang, 'menu')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Board;
