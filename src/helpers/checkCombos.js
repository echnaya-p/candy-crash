import {SIZE_BOARD} from "./constants";
import {isLastIndex} from "./utils";

function horizontalCheck(candies) {
    const combo = [];

    const checkRow = (i) => {
        if (isLastIndex(i + 1) || isLastIndex(i + 2)) {
            return;
        }

        if (candies[i] !== 'white' && (candies[i] === candies[i + 1]) && (candies[i] === candies[i + 2])) {
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
        if (candies[i] !== 'white' && (candies[i] === candies[i + SIZE_BOARD]) && (candies[i] === candies[i + 2 * SIZE_BOARD])) {
            combo.push(i, i + SIZE_BOARD, i + 2 * SIZE_BOARD);
        }
    }

    for (let i = 0; i < SIZE_BOARD * (SIZE_BOARD - 2); i++) {
        checkColumn(i);
    }

    return combo;
}


function getNeighbors(index) {
    const neighbors = [];
    const row = Math.floor(index / SIZE_BOARD);
    const col = index % SIZE_BOARD;

    if (row > 0) neighbors.push(index - SIZE_BOARD);
    if (row < SIZE_BOARD - 1) neighbors.push(index + SIZE_BOARD);
    if (col > 0) neighbors.push(index - 1);
    if (col < SIZE_BOARD - 1) neighbors.push(index + 1);

    return neighbors;
}

function expandCombo(comboIndices, candies) {
    const expanded = new Set(comboIndices);
    const queue = [...comboIndices];

    while (queue.length) {
        const current = queue.shift();
        const color = candies[current];

        for (const neighbor of getNeighbors(current)) {
            if (!expanded.has(neighbor) && candies[neighbor] === color) {
                expanded.add(neighbor);
                queue.push(neighbor);
            }
        }
    }

    return expanded;
}

export function checkCombos(candies) {
    const baseCombo = new Set([...horizontalCheck(candies), ...verticalCheck(candies)]);

    if (baseCombo.size === 0) return [];

    const expanded = expandCombo(baseCombo, candies);

    return Array.from(expanded);
}