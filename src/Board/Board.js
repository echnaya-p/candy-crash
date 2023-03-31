import {Grid} from "@mui/material";
import {checkCombos} from "../helpers/checkCombos";
import {useEffect, useState} from "react";
import {generateCandies, swapColors} from "../helpers/utils";
import {updateCandies} from "../helpers/updatedCandies";

function Board() {
    const [candies, setCandies] = useState(generateCandies());
    const [isCheck, setIsCheck] = useState(false);
    const [fistElementForSwap, setFirstElementForSwap] = useState(null)
    const [secondElementForSwap, setSecondElementForSwap] = useState(null)


    const handleCheck = () => {
        const combo = checkCombos(candies);

        if (combo.length) {
           const showWhiteCandies = candies.map((candy, index) => combo.includes(index) ? 'white' : candy);

           setCandies(showWhiteCandies);
           setIsCheck(true);
        }

    };

    const handleClick = (id) => {
        if (fistElementForSwap) {
            setSecondElementForSwap(id);
        } else {
            setFirstElementForSwap(id);
        }
    }

    const isCheckSelectedItem = (id) => {
        return fistElementForSwap === id || secondElementForSwap === id
    }

    useEffect(() => {
        if (fistElementForSwap && secondElementForSwap) {
            const updatedCandies = swapColors(candies, fistElementForSwap, secondElementForSwap);
            setCandies(updatedCandies);
            setIsCheck(true);
            setFirstElementForSwap(null);
            setSecondElementForSwap(null);
        }
    }, [secondElementForSwap])

    useEffect(() => {
        let timer;

        if (!isCheck) {
            timer = setTimeout(() => handleCheck(), 1000);
        }

        return () => {
            if (!isCheck) {
                clearTimeout(timer);
            }
        }
    }, [isCheck]);

    useEffect(() => {
        let timer;

        if (isCheck) {
            timer = setTimeout(() => {
                const newCandies = updateCandies(candies);

                setCandies(newCandies);
                setIsCheck(false);
            }, 1000);
        }

        return () => {
            if (isCheck) {
                clearTimeout(timer);
            }
        }

    }, [candies, isCheck]);

    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
           <Grid container columns={8} style={{ width: 400}}>
               {candies.map((color, index) => (
                   <Grid item
                         key={index}
                         style={{
                             width: '50px',
                             height: '50px',
                             backgroundColor: `${color}`,
                             border: `1px solid ${isCheckSelectedItem(index) ? 'white' : 'gray'}`
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

export default Board