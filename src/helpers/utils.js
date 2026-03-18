import {COLORS, SIZE_BOARD} from "./constants";

export function isLastIndex(index) {
    return index % SIZE_BOARD === 0;
}

export function generateCandy() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function generateCandies() {
    return Array.from({length: SIZE_BOARD * SIZE_BOARD}, () => generateCandy());
}

export function updateCandy(index, candies) {
    const indexPreviousCandy = index - SIZE_BOARD;

    if (indexPreviousCandy < 0) {
        return [generateCandy(), candies];
    }

    if (candies[indexPreviousCandy] === 'white') {
        return updateCandy(indexPreviousCandy, candies)
    }

    return [candies[indexPreviousCandy], [...candies.slice(0, indexPreviousCandy), 'white', ...candies.slice(indexPreviousCandy + 1)]];
}

export function swapColors(colors, index1, index2) {
    const result = [...colors];
    result[index1] = colors[index2];
    result[index2] = colors[index1];

    return result;
}