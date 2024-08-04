//All the necessary imports
import { Auth } from "../auth";
import { Router } from "../router";
import { TableModal } from "../modals/tableModal";
import { ChessAlertModal } from "../modals/chessAlertModal";
import { minimaxRoot } from "./game/offlineGameServices/gameLogic";
import { updateStatus } from "./game/offlineGameServices/updateStatus";
import { initializeGameControls } from "./game/offlineGameServices/gameControls";
import { sessionChangeListeners } from "../utils/sessionChangeListener";
import { gameDifficultySelection } from "./game/offlineGameServices/gameDifficultySelection";
//Setting up the audio for the piece moving
let pieceMove = new Audio();
pieceMove.src = "./assets/audio/pieceMoving.mp3";
let positionCount: number;

//Defining the theme for the board and the pieces
declare const metro_piece_theme: (piece: string) => string;
declare const chess24_board_theme: string[];

export function updatePositionCount() {
  positionCount++;
}
export function resetPositionCount() {
  positionCount = 0;
}
export let board: any,
  game = new Chess(); //Initialzing a new game from chess.js
export const modal = new ChessAlertModal();

export class OfflinePage {
  static async load(): Promise<string> {
    if (!Auth.isLoggedIn()) {
      window.location.hash = "#/login";
      Router.loadContent();
      return "";
    }
    const response = await fetch("src/views/offline.html");
    return response.text();
  }

  static initEventListeners() {
    sessionChangeListeners();
    const tableModal = new TableModal("tableModal");
    function openModalWithMoveHistory(moves: []) {
      tableModal.show(moves);
    }
    document
      .getElementById("openModalButton")!
      .addEventListener("click", () => {
        openModalWithMoveHistory(game.history()); //Function to show the moves table when the show game moves button is clicked
      });
    gameDifficultySelection(); //Select the game difficulty on game loading
    let onDragStart = function (source: any, piece: string) {
      if (
        game.in_checkmate() === true ||
        game.in_draw() === true ||
        piece.search(/^b/) !== -1
      ) {
        return false;
      }
    };

    let makeBestMove = function () {
      let bestMove = getBestMove(game); // Function to get the best move by using minimax algorithm
      game.move(bestMove); //Function to set the game state according to the move recieved form the algorithm
      board.position(game.fen());
      pieceMove.play();
      setTimeout(updateStatus, 800);

      if (game.game_over()) {
        alert("Game over");
      }
    };

    let getBestMove = function (game: any) {
      if (game.game_over()) {
        modal.show("Game over", []);
        return;
      }

      positionCount = 0;
      let depth = parseInt($("#search-depth").find(":selected").text());
      let bestMove = minimaxRoot(depth, game, true); //Initial call to minimaxroot algorithm to setup the root node of the minimax tree
      return bestMove;
    };

    let onDrop = function (source: string, target: string): string | void {
      let move = game.move({
        from: source,
        to: target,
        promotion: "q",
      });

      if (move === null) {
        return "snapback";
      }
      pieceMove.play();
      window.setTimeout(makeBestMove, 250); //After the player makes the move call the makeBestMove after some dealy to ensure smooth user experience
    };

    //After the move is made then update the board position as well the status text
    let onSnapEnd = function () {
      board.position(game.fen());
      updateStatus();
      pieceMove.play();
    };
    //Initializing the chess board with all the necessary properties
    let chess = {
      draggable: true,
      position: "start",
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd,
      pieceTheme: metro_piece_theme,
      boardTheme: chess24_board_theme,
    };

    board = ChessBoard("board", chess);

    //Initializing all the game controls event listeners like abort,play,pause e.t.c
    initializeGameControls(game, board);
  }
}
