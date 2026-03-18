import { BoardState } from '../types';
import { SIZE_BOARD } from './constants';
import { updateCandy } from './utils';

export function updateCandies(candies: BoardState): BoardState {
   let copy = [...candies];
   const updatedCandies: BoardState = [];

   for (let i = SIZE_BOARD * SIZE_BOARD - 1; i >= 0; i--) {
       if (copy[i] === 'white') {
           const [color, updatedCopy] = updateCandy(i, copy);
           updatedCandies.unshift(color);
           copy = updatedCopy;
       } else {
           updatedCandies.unshift(copy[i]);
       }
   }

   return updatedCandies;
}
