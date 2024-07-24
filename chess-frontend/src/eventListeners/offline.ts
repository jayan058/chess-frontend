import { Auth } from "../auth";
import { Router } from "../router";
import { TableModal } from "../modals/tableModal";
import { ChessAlertModal } from "../modals/chessAlertModal";
import { minimaxRoot } from "../offlineGameServices/gameLogic";
import { updateStatus } from "../offlineGameServices/updateStatus";
import { initializeGameControls } from "../offlineGameServices/gameControls";

let positionCount: number;

export function updatePositionCount() {
  positionCount++;
}
export function resetPositionCount() {
  positionCount=0;
}
export let board: any,
  game = new Chess();
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
    const tableModal = new TableModal("tableModal");
    function openModalWithMoveHistory(moves: []) {
      tableModal.show(moves);
    }
    document
      .getElementById("openModalButton")!
      .addEventListener("click", () => {
        openModalWithMoveHistory(game.history());
      });
    modal.show("Choose your level:", [
      { text: "Easy", onClick: () => startGame(1) },
      { text: "Medium", onClick: () => startGame(2) },
      { text: "Hard", onClick: () => startGame(3) },
    ]);

    function startGame(level: number) {
      modal.hide();
      const depth = level === 1 ? 1 : level === 2 ? 2 : 3;
      const searchDepthSelect = document.getElementById(
        "search-depth"
      ) as HTMLSelectElement;
      searchDepthSelect.value = depth.toString();
      searchDepthSelect.disabled = true;
      modal.show("YOU MAKE THE FIRST MOVE", []);
      setTimeout(() => {
        modal.hide();
      }, 2000);
    }

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
      let bestMove = getBestMove(game);
      game.move(bestMove);
      board.position(game.fen());
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

      let d = new Date().getTime();
      let bestMove = minimaxRoot(depth, game, true);
      let d2 = new Date().getTime();
      let moveTime = d2 - d;
      let positionsPerS = (positionCount * 1000) / moveTime;

      $("#position-count").text(positionCount);
      $("#time").text(moveTime / 1000 + "s");
      $("#positions-per-s").text(positionsPerS);
      return bestMove;
    };

    let onDrop = function (source: string, target: string): string | void {
      let move = game.move({
        from: source,
        to: target,
        promotion: "q",
      });

      removeGreySquares();
      if (move === null) {
        return "snapback";
      }

      window.setTimeout(makeBestMove, 250);
    };

    let onSnapEnd = function () {
      board.position(game.fen());
      updateStatus();
    };

    let onMouseoverSquare = function (square: any) {
      let moves = game.moves({
        square: square,
        verbose: true,
      });

      if (moves.length === 0) return;

      greySquare(square);

      for (let i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
      }
    };

    let onMouseoutSquare = function () {
      removeGreySquares();
    };

    let removeGreySquares = function () {
      $("#board .square-55d63").css("background", "");
    };

    let greySquare = function (square: string) {
      let squareEl = $("#board .square-" + square);

      let background = "#a9a9a9";
      if (squareEl.hasClass("black-3c85d") === true) {
        background = "#696969";
      }

      squareEl.css("background", background);
    };

    let cfg = {
      draggable: true,
      position: "start",
      onDragStart: onDragStart,
      onDrop: onDrop,
      onMouseoutSquare: onMouseoutSquare,
      onMouseoverSquare: onMouseoverSquare,
      onSnapEnd: onSnapEnd,
    };
    // Pause functionality

    board = ChessBoard("board", cfg);
    initializeGameControls(game, board);
  }
}
