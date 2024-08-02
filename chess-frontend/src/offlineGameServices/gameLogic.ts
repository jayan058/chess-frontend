import { evaluateBoard, reverseArray } from "./gameUtility";
import { Piece } from "chess.js";
import { updatePositionCount } from "../components/offline";

const minimaxRoot = (depth: number, game: any, isMaximisingPlayer: boolean) => {
  const newGameMoves = game.moves();
  let bestMove = -9999;
  let bestMoveFound;

  for (const newGameMove of newGameMoves) {
    game.move(newGameMove);
    const value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
    game.undo();
    if (value >= bestMove) {
      bestMove = value;
      bestMoveFound = newGameMove;
    }
  }
  return bestMoveFound;
};

const minimax = (
  depth: number,
  game: any,
  alpha: number,
  beta: number,
  isMaximisingPlayer: boolean,
) => {
  updatePositionCount();
  if (depth === 0) {
    return -evaluateBoard(game.board());
  }

  const newGameMoves = game.moves();
  if (isMaximisingPlayer) {
    let bestMove = -9999;
    for (const newGameMove of newGameMoves) {
      game.move(newGameMove);
      bestMove = Math.max(
        bestMove,
        minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer),
      );
      game.undo();
      alpha = Math.max(alpha, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
    return bestMove;
  } else {
    let bestMove = 9999;
    for (const newGameMove of newGameMoves) {
      game.move(newGameMove);
      bestMove = Math.min(
        bestMove,
        minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer),
      );
      game.undo();
      beta = Math.min(beta, bestMove);
      if (beta <= alpha) {
        return bestMove;
      }
    }
    return bestMove;
  }
};

let pawnEvalWhite = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
  [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
  [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
  [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
  [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
  [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
];

let pawnEvalBlack = reverseArray(pawnEvalWhite);

let knightEval = [
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
  [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
  [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
  [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
  [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
  [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
];

let bishopEvalWhite = [
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
  [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
  [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
  [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
  [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
];

let bishopEvalBlack = reverseArray(bishopEvalWhite);

let rookEvalWhite = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0],
];

let rookEvalBlack = reverseArray(rookEvalWhite);

let evalQueen = [
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
];

let kingEvalWhite = [
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
  [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
  [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
  [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0],
];

let kingEvalBlack = reverseArray(kingEvalWhite);

const getPieceValue = (piece: Piece, x: number, y: number) => {
  if (piece === null) {
    return 0;
  }
  let getAbsoluteValue = function (
    piece: Piece,
    isWhite: boolean,
    x: number,
    y: number,
  ) {
    if (piece.type === "p") {
      return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
    } else if (piece.type === "r") {
      return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
    } else if (piece.type === "n") {
      return 30 + knightEval[y][x];
    } else if (piece.type === "b") {
      return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
    } else if (piece.type === "q") {
      return 90 + evalQueen[y][x];
    } else if (piece.type === "k") {
      return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
    }
    throw "Unknown piece type: " + piece.type;
  };

  let absoluteValue = getAbsoluteValue(piece, piece.color === "w", x, y);
  return piece.color === "w" ? absoluteValue : -absoluteValue;
};

export { minimaxRoot, minimax, getPieceValue };
