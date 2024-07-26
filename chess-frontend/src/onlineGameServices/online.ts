import { Chess } from "chess.js";

import { Game } from "./updatePlayersinfo";
import socketInstance from '../utils/socket';
import { Auth } from "../auth";
const socket = socketInstance.getSocket();


interface Player {
  socketId: string;
  name: string;
  profilePicture: string;
  roomId: number;
  userId: number;
  color: string; // Add color property
}

export class Online {
  private static game: Chess;
  private static board: any;
  private static currentTurn: string = "w"; // Default turn to white
  private static whitePlayer: Player;
  private static blackPlayer: Player;
  private static myColor: string; // Add this to track the current player's color
 

  static async load(): Promise<string> {
    const response = await fetch("src/views/online.html");
    return response.text();
  }

  static async init(players: Player[]): Promise<void> {
    // Assuming players[0] is white and players[1] is black
    this.whitePlayer = players[0];
    this.blackPlayer = players[1];

    // Determine the player's color
    this.myColor = players.find((p) => p.socketId === socket.id)?.color || "w";

    console.log(this.whitePlayer);
    console.log(this.blackPlayer);
    console.log(`My color is: ${this.myColor}`);

    this.currentTurn = "w"; // White starts first
    this.initEventListeners();
    this.updateTurnIndicator(this.currentTurn);
  }

  static initEventListeners() {
   console.log(Auth.getAccessToken());
   
    this.game = new Chess();
    setTimeout(() => {
      this.board = ChessBoard("board", {
        draggable: true,
        position: "start",
        onDrop: this.handleMove.bind(this),
        onSnapEnd: this.onSnapEnd.bind(this),
      });
    }, 100);
    // Clear previous event handlers if any
    socket.off("gameStarted");
    socket.off("turn");
    socket.off("move");
    socket.off("error");
    socket.off("playerInfo");

    // Set up event handlers
    socket.on("gameStarted", (players) => {     
        console.log("here");
        
      this.init(players.participants); // Initialize with new players
    });

    socket.on("turn", (turn) => {
      console.log(`It's now ${turn}'s turn.`);
      this.currentTurn = turn; // Update current turn
      this.updateTurnIndicator(turn);
    });

    socket.on("playerInfo", (data) => {
        console.log("Recieved");
        
        
      
        setTimeout(() => {
               const game = new Game('game-info');
                game.updatePlayerInfo(data);
            
        }, 1000); // 5000 milliseconds = 5 seconds
     
        
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
  }

  private static handleMove(source: string, target: string) {
    console.log("Handling move:", { source, target });
    console.log("Current FEN:", this.game.fen());

    if (this.myColor === this.getCurrentTurnColor()) {
      const move = { from: source, to: target };
      const result = this.game.move(move);
      if (result) {
        console.log("New FEN after move:", this.game.fen());
        this.updateBoard();

        const playerId = this.getCurrentPlayerId();
        this.sendMove(move, playerId, this.myColor); // Emit the move to the server
        this.switchTurn();
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

  // Event listeners for timers

  private static updateBoard() {
    if (this.board) {
      this.board.position(this.game.fen());
    }
  }

  private static onSnapEnd() {
    this.updateBoard();
  }

  private static renderBoard() {
    this.updateBoard();
  }

  private static sendMove(
    move: { from: string; to: string },
    playerId: number,
    myColor: string
  ) {
    socket.emit("move", move, playerId, myColor); // Send the move object to the server
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
    console.log(`Turn indicator updated to: ${turn}`);
  }

  private static switchTurn() {
    // Switch the turn
    this.currentTurn = this.currentTurn === "w" ? "b" : "w";
    console.log(this.currentTurn);

    this.updateTurnIndicator(this.currentTurn);
    socket.emit("turn", this.currentTurn); // Notify the server of the turn change
  }
}
