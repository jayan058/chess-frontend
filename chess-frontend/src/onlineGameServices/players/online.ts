import { Chess } from "chess.js";
import { Game } from "./updatePlayersinfo";
import socketInstance from "../../utils/socket";
import { ModalManager } from "../../utils/modal";
import { PlayerInfo } from "../../interfaces/playersInfo";
import { sendTextMessage } from "./textMessages";
const socket = socketInstance.getSocket();
export let myData: PlayerInfo;
let pieceMove = new Audio();
pieceMove.src = "./assets/audio/pieceMoving.mp3";
import { Player } from "../../interfaces/player";

declare const metro_piece_theme: (piece: string) => string;
declare const chess24_board_theme: string[];

export class Online {
  private static game: Chess;
  public static board: any;
  private static currentTurn: string = "w";
  private static whitePlayer: Player;
  private static blackPlayer: Player;
  private static myColor: string;

  static async load(): Promise<string> {
    const response = await fetch("src/views/online.html");
    return response.text();
  }

  static async init(players: Player[]): Promise<void> {
    this.initEventListeners();
    setTimeout(() => {
      this.board = ChessBoard("board", {
        draggable: true,
        position: "start",
        onDrop: this.handleMove.bind(this),
        onSnapEnd: this.onSnapEnd.bind(this),
        pieceTheme: metro_piece_theme,
        boardTheme: chess24_board_theme,
      });
    }, 3000);
    // Assuming players[0] is white and players[1] is black
    this.whitePlayer = players[0];
    this.blackPlayer = players[1];

    // Determine the player's color
    this.myColor = players.find((p) => p.socketId === socket.id)?.color || "w";

    this.currentTurn = "w"; // White starts first
    this.updateTurnIndicator(this.currentTurn);
  }

  static initEventListeners() {
    sendTextMessage();
   
    this.game = new Chess();

    // Clear previous event handlers if any
    socket.off("gameStarted");
    socket.off("turn");
    socket.off("move");
    socket.off("error");
    socket.off("playerInfo");
    socket.off("randomMatchRequest");

    // Set up event handlers
    socket.on("gameStarted", (players) => {
      this.init(players.participants); // Initialize with new players
    });

    socket.on("turn", (turn) => {
      this.currentTurn = turn; // Update current turn
      this.updateTurnIndicator(turn);
    });

    socket.on("playerInfo", (data) => {
      myData = data;
      setTimeout(() => {
        if (data.myColor == "black") {
          this.board.flip();
        }
        const game = new Game("game-info");
        game.updatePlayerInfo(data);
      }, 3000); // 5000 milliseconds = 5 seconds
    });
    socket.on(
      "timerUpdate",
      (data: { color: "white" | "black"; time: number }) => {
        if (data.color === "white") {
          this.updateTimerDisplay("white-timer", data.time);
        } else {
          this.updateTimerDisplay("black-timer", data.time);
        }
      },
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
      // Check if move is valid
      const result = this.game.move(move);
      if (result) {
        this.updateBoard();
        this.renderBoard();
        pieceMove.play();
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

      let timeout = setTimeout(() => {
        modal.close();
        window.location.hash = "#/welcome";
        clearTimeout(timeout);
      }, 8000);
    });

    socket.on(
      "revertResponse",
      (response: { accepted: boolean; move: any }) => {
        if (response.accepted) {
          this.game.undo();
          this.updateBoard();
        } else {
          alert("Move revert request denied by opponent");
        }
      },
    );

    socket.on("checkMate", (message) => {
      const modal = new ModalManager("myModal", "modalMessage", "close");
      modal.show(message.reason, "success");
    });
  }

  public static handleMove(source: string, target: string) {
    if (this.myColor === this.getCurrentTurnColor()) {
      const move = { from: source, to: target };
      const result = this.game.move(move);
      if (result) {
        this.updateBoard();
        this.checkGameStatus();
        const playerId = this.getCurrentPlayerId();
        this.sendMove(move, playerId, this.myColor); // Emit the move to the server
        this.switchTurn();
        pieceMove.play();
      } else {
        console.warn("Invalid move attempted:", move);
        return "snapback";
      }
    } else {
      return "snapback";
    }
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

  private static checkGameStatus() {
    let result = "";

    if (this.game.isCheckmate()) {
      const winner = this.getCurrentTurnColor() === "w" ? "Black" : "White";
      result = `${winner} is in checkmate! ${this.getCurrentTurnColor()} wins the Game`;
      // Emit checkmate event and handle end of game
      this.handleGameOver(result);
    } else if (this.game.isStalemate()) {
      result = "Stalemate! Game is a draw.";
      this.handleGameOver(result);
    } else if (this.game.isThreefoldRepetition()) {
      result = "Threefold repetition! Game is a draw.";
      this.handleGameOver(result);
    } else if (this.game.isDraw()) {
      result = "Game is a draw.";
      this.handleGameOver(result);
    } else if (this.game.inCheck()) {
      socket.emit("check", { reason: `Check` });
    }
  }

  // Event listeners for timers

  private static updateBoard() {
    if (this.board) {
      this.board.position(this.game.fen());
    }
  }
  

  public static onSnapEnd() {
    this.updateBoard();
  }
  private static handleGameOver(message: string) {
    // Emit game-over event to server
    socket.emit("gameOver", { reason: message });
  }

  private static renderBoard() {
    this.updateBoard();
  }

  private static sendMove(
    move: { from: string; to: string },
    playerId: number,
    myColor: string,
  ) {
    socket.emit("move", move, playerId, myColor, this.game.fen()); // Send the move object to the server
  }

  private static getCurrentPlayerId(): number {
    return this.currentTurn === "w"
      ? this.whitePlayer.userId
      : this.blackPlayer.userId;
  }

  private static getCurrentTurnColor(): string {
    // Return the color corresponding to the current turn
    return this.currentTurn === "w" ? "white" : "black";
  }

  private static updateTurnIndicator(turn: string) {
    // Update UI to reflect whose turn it is
    const turnIndicator = document.getElementById("turn-indicator");
    if (turnIndicator) {
      if (turn === "w") {
        turnIndicator.innerText = `Current turn: ${this.whitePlayer.name}`;
      } else {
        turnIndicator.innerText = `Current turn: ${this.blackPlayer.name}`;
      }
    }
  }

  private static switchTurn() {
    // Switch the turn
    this.currentTurn = this.currentTurn === "w" ? "b" : "w";

    this.updateTurnIndicator(this.currentTurn);
    socket.emit("turn", this.currentTurn); // Notify the server of the turn change
  }
}

Online.initEventListeners();
