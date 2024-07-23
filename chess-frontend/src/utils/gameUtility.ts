// utils.ts
import { getPieceValue } from "./gameLogic";
export const reverseArray = (array: number[][]) => array.slice().reverse();

export const evaluateBoard = (board: any) => {
    let totalEvaluation = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            totalEvaluation += getPieceValue(board[i][j], i, j);
        }
    }
    return totalEvaluation;
};

// Additional functions like minimax, minimaxRoot, getPieceValue, and evaluation arrays
// can be added here or in separate files if necessary.
