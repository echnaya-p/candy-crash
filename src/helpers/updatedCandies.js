import {SIZE_BOARD} from "./constants";
import {updateCandy} from "./utils";

export function updateCandies(candies) {
   let copy = [...candies]
   const updatedCandies = [];

   for (let i = SIZE_BOARD * SIZE_BOARD - 1; i >= 0; i--) {
       if (copy[i] === 'white') {
           const [color, updateCandies] = updateCandy(i, copy)
           updatedCandies.unshift(color);
           copy = updateCandies;
       } else {
           updatedCandies.unshift(copy[i]);
       }
   }

   return updatedCandies
}