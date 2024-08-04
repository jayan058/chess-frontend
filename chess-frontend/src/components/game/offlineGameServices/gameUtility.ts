//All the necessary imports
import { getPieceValue } from "./gameLogic";
export const reverseArray = (array: number[][]) => array.slice().reverse();

//Looping through all the squares of the board to get the value of all the pieces on the board that are in the different position within the board
export const evaluateBoard = (board: any) => {
  let totalEvaluation = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      totalEvaluation += getPieceValue(board[i][j], i, j);
    }
  }
  return totalEvaluation;
};
