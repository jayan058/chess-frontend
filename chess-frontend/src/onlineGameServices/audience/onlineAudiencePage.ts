// eventListeners/home.ts
import { Chess } from "chess.js";
import { ModalManager } from "../../utils/modal";
import socketInstance from "../../utils/socket";
const socket = socketInstance.getSocket();

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
          draggable: true,
          position: "start",
         
        });
      }, 0);
      
    this.game = new Chess();
    socket.off("gameStarted");
    socket.off("turn");
    socket.off("move");
    socket.off("error");
    socket.off("playerInfo");
    socket.on("move", (move) => {
      console.log("Move received from server:", move);
      console.log("Current FEN before applying move:", this.game.fen());

      // Check if move is valid
      const result = this.game.move(move);
      if (result) {
        console.log("New FEN after applying move:", this.game.fen());
        this.updateBoard();
        this.renderBoard();
      } else {
        console.warn("Invalid move received from server:", move);
      }
    });
    socket.on(
      "timerUpdate",
      (data: { color: "white" | "black"; time: number }) => {
        console.log(data);

        if (data.color === "white") {
          this.updateTimerDisplay("white-timer", data.time);
        } else {
          this.updateTimerDisplay("black-timer", data.time);
        }
      }
    );
    socket.on("game-over", (data) => {
      const modal = new ModalManager("myModal", "modalMessage", "close");
      modal.show(data, "success");

      setTimeout(() => {
        modal.close();
        window.location.hash = "#/welcome";
      }, 5000);
    });

    socket.on("move", (move) => {
      console.log("Move received from server:", move);
      console.log("Current FEN before applying move:", this.game.fen());

      // Check if move is valid
      const result = this.game.move(move);
      if (result) {
        console.log("New FEN after applying move:", this.game.fen());
        this.updateBoard();
        this.renderBoard();
      } else {
        console.warn("Invalid move received from server:", move);
      }
    });
    socket.on("timeOut", (message) => {
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
      console.log(message);

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
    socket.on("latestFen", (latestFen) => {
        console.log(latestFen);
        console.log("Setting board positiom..........");
        
        this.board.position(latestFen)
        this.game.load(latestFen);
      
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
  private static updateTimerDisplay(elementId: string, time: number) {
    const timerElement = document.getElementById(elementId);
    if (timerElement) {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      timerElement.innerText = `${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    }
  }
}