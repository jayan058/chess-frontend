//All the necessary imports
import { Chess } from "chess.js";
import { Game } from "./updatePlayersinfo";
import socketInstance from "../../../../utils/socket";
import { ModalManager } from "../../../../utils/modal";
import { PlayerInfo } from "../../../../interfaces/playersInfo";
import { sendTextMessage } from "./textMessages";
import { Player } from "../../../../interfaces/player";
import { Auth } from "../../../../auth";
import { Router } from "../../../../router";

const socket = socketInstance.getSocket(); //Getting a new socket instance from SocketSingleton class
export let myData: PlayerInfo;

//Defining the new audio variable
let pieceMove = new Audio();
pieceMove.src = "./assets/audio/pieceMoving.mp3";

//Piece and board themes
declare const metro_piece_theme: (piece: string) => string;
declare const chess24_board_theme: string[];

//Class to handle all the game functions (move,turn,checkmate,check,timeout,gameover)
export class Online {
  //All the static variables
  private static game: Chess;
  public static board: any;
  private static currentTurn: string = "w";
  private static whitePlayer: Player;
  private static blackPlayer: Player;
  private static myColor: string;

  static async load(): Promise<string> {
    if (!Auth.isLoggedIn()) {
      window.location.hash = "#/login";
      Router.loadContent();
      return "";
    }
    const response = await fetch("src/views/online.html");
    return response.text();
  }

  static async init(players: Player[]): Promise<void> {
    this.initEventListeners();

    //Initializing the board after 3000ms to ensure all the event listeners are properly setup and are ready to recieve events form the server
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

    this.whitePlayer = players[0];
    this.blackPlayer = players[1];
    //Determinig which color does the player belong tp
    this.myColor = players.find((p) => p.socketId === socket.id)?.color || "w";
    //Variable to manage turn.Initially its whites turn
    this.currentTurn = "w";
    this.updateTurnIndicator(this.currentTurn);
  }

  static initEventListeners() {
    sendTextMessage();
    this.game = new Chess();
    // Clear previous event handlers to avoid unexpected behaviours
    socket.off("gameStarted");
    socket.off("turn");
    socket.off("move");
    socket.off("error");
    socket.off("playerInfo");
    socket.off("randomMatchRequest");

    // Game started event recieved with all the deatils of the players who are in the room
    socket.on("gameStarted", (players) => {
      this.init(players.participants); // Initialize with new players in the room
    });

    socket.on("turn", (turn) => {
      this.currentTurn = turn; // Update whose turn it is currently
      this.updateTurnIndicator(turn); //Update the turn indicator
    });

    socket.on("playerInfo", (data) => {
      myData = data;
      //Initializing the game information after 3000ms to ensure all the event listeners are properly setup and are ready to recieve events form the server
      setTimeout(() => {
        if (data.myColor == "black") {
          this.board.flip();
        }
        const game = new Game("game-info");
        game.updatePlayerInfo(data);
      }, 3000);
    });

    //Event to update the timer recieved from the server after every move along with which colors timer to decrease
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
    //Event recieved regarding game-over by opponent leaving the game (disconnect)
    socket.on("game-over", (data) => {
      const modal = new ModalManager("myModal", "modalMessage", "close");
      modal.show(data, "success");

      setTimeout(() => {
        modal.close();
        window.location.hash = "#/welcome";
      }, 5000); //Redirecting to the welcome after the game is over
    });
    //Event recieved regarding move from the server
    socket.on("move", (move) => {
      const result = this.game.move(move);
      //Checking if the move is valid
      if (result) {
        this.updateBoard(); //If move valid then update the board
        this.renderBoard(); //Render the board after the move is applied
        pieceMove.play(); //Play the sound after the move is applied
      } else {
        console.warn("Invalid move received from server:", move);
      }
    });

    //Event recieved regarding timeout for one of the players
    socket.on("timeOut", (message) => {
      const modal = new ModalManager("myModal", "modalMessage", "close");
      modal.show(message, "error"); //Show the timeout message as a modal
      let timeout = setTimeout(() => {
        modal.close();
        window.location.hash = "#/welcome";
        clearTimeout(timeout);
      }, 8000);
    });
    //Event recieved regarding game-over by moves(checkmate)
    socket.on("gameOverByMoves", (message) => {
      const modal = new ModalManager("myModal", "modalMessage", "close");
      modal.show(message.reason, "error");

      let timeout = setTimeout(() => {
        modal.close();
        window.location.hash = "#/welcome";
        clearTimeout(timeout);
      }, 8000);
    });

    //Event recieved regarding check
    socket.on("checkMate", (message) => {
      const modal = new ModalManager("myModal", "modalMessage", "close");
      modal.show(message.reason, "success");
    });
  }

  //Function to handle the move after it is recieved
  public static handleMove(source: string, target: string) {
    if (this.myColor === this.getCurrentTurnColor()) {
      //Only apply the move if currently it is mycolors turn
      const move = { from: source, to: target };
      const result = this.game.move(move);
      if (result) {
        //Only apply the move if it is valid(legal)
        this.checkGameStatus();
        const playerId = this.getCurrentPlayerId();
        this.sendMove(move, playerId, this.myColor); // Emit the move to the server
        this.switchTurn(); //Switch the turn
        pieceMove.play();
      } else {
        console.warn("Invalid move attempted:", move);
        return "snapback";
      }
    } else {
      //Snapback if it is not my turn
      return "snapback";
    }
  }
  //Function to update the display of the timer
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
  //Function to checkgame status(check,draw,checkmate)
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

  //Function to update the board

  private static updateBoard() {
    if (this.board) {
      this.board.position(this.game.fen());
    }
  }

  public static onSnapEnd() {
    this.updateBoard();
  }

  //Function to handle the gameover scenario(checkmate)
  private static handleGameOver(message: string) {
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
  //Function to get whose turn it currently is
  private static getCurrentTurnColor(): string {
    // Return the color corresponding to the current turn
    return this.currentTurn === "w" ? "white" : "black";
  }
  //Function to update the turn indicator
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
  //Function to switch the turn after every move
  private static switchTurn() {
    // Switch the turn
    this.currentTurn = this.currentTurn === "w" ? "b" : "w";

    this.updateTurnIndicator(this.currentTurn);
    socket.emit("turn", this.currentTurn); // Notify the server of the turn change
  }
}

Online.initEventListeners();
