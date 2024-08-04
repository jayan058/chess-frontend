// eventListeners/home.ts
import { Chess } from "chess.js";
import { ModalManager } from "../../../../utils/modal";
import socketInstance from "../../../../utils/socket";
const socket = socketInstance.getSocket();
let pieceMove = new Audio();
pieceMove.src = "./assets/audio/pieceMoving.mp3";

declare const metro_piece_theme: (piece: string) => string;
declare const chess24_board_theme: string[];

import { displayPlayerVsPlayer } from "./gamePlayersInfo";
export class OnlineAudiencePage {
  private static game: Chess;
  private static board: any;
  static async load(): Promise<string> {
    const response = await fetch("src/views/onlineAudiencePage.html");
    return response.text();
  }

  static initEventListeners() {
    setTimeout(() => {
      this.board = ChessBoard("board", {
        draggable: false,
        position: "start",
        pieceTheme: metro_piece_theme,
        boardTheme: chess24_board_theme,
      });
    }, 0);

    this.game = new Chess();
    socket.off("gameStarted");
    socket.off("turn");
    socket.off("move");
    socket.off("error");
    socket.off("playerInfo");
    socket.off("latestData");
    socket.off("randomMatchRequest");

    socket.on("move", (move) => {
      // Check if move is valid
      const result = this.game.move(move);
      if (result) {
        this.updateBoard();
        this.renderBoard();
      } else {
        console.warn("Invalid move received from server:", move);
      }
    });

    socket.on("game-over", () => {
      const modal = new ModalManager("myModal", "modalMessage", "close");
      modal.show("Game Over!!! One of the players disconnected", "success");

      setTimeout(() => {
        modal.close();
        window.location.hash = "#/welcome";
      }, 5000);
    });

    socket.on("move", (move) => {
      pieceMove.play();
      // Check if move is valid
      const result = this.game.move(move);
      if (result) {
        this.updateBoard();
        this.renderBoard();
      } else {
        console.warn("Invalid move received from server:", move);
      }
    });
    socket.on("timeOutNotifyForAudience", (message) => {
      const modal = new ModalManager("myModal", "modalMessage", "close");
      modal.show(message, "error");

      let timeout = setTimeout(() => {
        modal.close();
        window.location.hash = "#/welcome";
        clearTimeout(timeout);
      }, 8000);
    });

    socket.on("gameOverByMoves", (message) => {
      const modal = new ModalManager("myModal", "modalMessage", "close");
      modal.show(message.reason, "error");

      let timeout = setTimeout(() => {
        modal.close();
        window.location.hash = "#/welcome";
        clearTimeout(timeout);
      }, 8000);
    });

    socket.on("checkMate", (message) => {
      const modal = new ModalManager("myModal", "modalMessage", "close");
      modal.show(message.reason, "success");
      // setTimeout(() => modal.close(), 3000);
    });
    socket.on("latestData", (latestData) => {
      displayPlayerVsPlayer([
        latestData.participants[0],
        latestData.participants[1],
        latestData.user[0].name,
      ]);

      this.board.position(latestData.latestFen);
      this.game.load(latestData.latestFen);
    });
  }

  private static updateBoard() {
    if (this.board) {
      this.board.position(this.game.fen());
    }
  }

  private static renderBoard() {
    this.updateBoard();
  }
}
