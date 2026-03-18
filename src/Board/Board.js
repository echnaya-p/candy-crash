import {Grid} from "@mui/material";
import {checkCombos} from "../helpers/checkCombos";
import {useCallback, useEffect, useState} from "react";
import {generateCandies, swapColors} from "../helpers/utils";
import {updateCandies} from "../helpers/updatedCandies";

const boardStyle = {display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'};
const gridStyle = {width: 400};
const CELL_SIZE = '50px';

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

        const timer = setTimeout(() => handleCheck(), 1000);

        return () => clearTimeout(timer);
    }, [isCheck, handleCheck]);

    useEffect(() => {
        if (!isCheck) return;

        const timer = setTimeout(() => {
            const newCandies = updateCandies(candies);

            setCandies(newCandies);
            setIsCheck(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [candies, isCheck]);

    return (
        <div style={boardStyle}>
           <Grid container columns={8} style={gridStyle}>
               {candies.map((color, index) => (
                   <Grid item
                         key={index}
                         style={{
                             width: CELL_SIZE,
                             height: CELL_SIZE,
                             backgroundColor: color,
                             border: `1px solid ${isSelectedItem(index) ? 'white' : 'gray'}`
                         }}
                         onClick={() => handleClick(index)}
                   >
                       {index}
                   </Grid>
               ))}
           </Grid>
        </div>
    );
}

export default Board;
