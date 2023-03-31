import {SIZE_BOARD} from "./constants";
import {isLastIndex} from "./utils";

function horizontalCheck(candies) {
    const combo = [];

    const checkRow = (i) => {
        if (isLastIndex(i + 1) || isLastIndex(i + 2)) {
            return;
        }

        if ((candies[i] === candies[i + 1]) && (candies[i] === candies[i + 2])) {
            combo.push(i, i + 1, i + 2);
        }
    }

    for (let i = 0; i < SIZE_BOARD * SIZE_BOARD; i++) {
        checkRow(i);
    }

    return combo;
}

function verticalCheck(candies) {
    const combo = [];

    const checkColumn = (i) => {
        if ((candies[i] === candies[i + SIZE_BOARD]) && (candies[i] === candies[i + 2 * SIZE_BOARD])) {
            combo.push(i, i + SIZE_BOARD, i + 2 * SIZE_BOARD);
        }
    }

    for (let i = 0; i < SIZE_BOARD * (SIZE_BOARD - 2); i++) {
        checkColumn(i);
    }

    return combo;
}


export function checkCombos(candies) {
    const candiesWithoutCombo = new Set([...horizontalCheck(candies), ...verticalCheck(candies)]);

    return Array.from(candiesWithoutCombo);
}