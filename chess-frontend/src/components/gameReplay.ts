//All the necessary imports
import { Chess } from "chess.js";
import { Auth } from "../auth";
import { Router } from "../router";
//Setting up the audio for the piece moving
let pieceMove = new Audio();
pieceMove.src = "./assets/audio/pieceMoving.mp3";

//Defining the theme for the board and the pieces
declare const metro_piece_theme: (piece: string) => string;
declare const chess24_board_theme: string[];

//Class to handle the game replay
export class GameReplay {
  private static game: Chess;
  private static board: any;
  private static gameMoves: { from: string; to: string }[] = [];
  private static currentMoveIndex: number = 0; //Reseting the currentMoveIndex to ensure smooth replay
  private static intervalId: number | null = null;

  static async load(): Promise<string> {
    if (!Auth.isLoggedIn()) {
      window.location.hash = "#/login";
      Router.loadContent();
      return "";
    }
    const response = await fetch("src/views/gameReplay.html");
    return response.text();
  }

  static initEventListeners() {
    this.board = ChessBoard("board", {
      draggable: false,
      position: "start",
      pieceTheme: metro_piece_theme,
      boardTheme: chess24_board_theme,
    });

    // Adding the control buttons event listeners
    document
      .getElementById("playBtn")
      ?.addEventListener("click", () => this.play());
    document
      .getElementById("pauseBtn")
      ?.addEventListener("click", () => this.pause());
    document
      .getElementById("nextBtn")
      ?.addEventListener("click", () => this.next());
    document
      .getElementById("rewindBtn")
      ?.addEventListener("click", () => this.rewind());
    document
      .getElementById("resetBtn")
      ?.addEventListener("click", () => this.reset()); // Add reset button listener

    // Retrieve moves from localStorage
    const storedMoves = localStorage.getItem("moves");
    if (storedMoves) {
      this.gameMoves = JSON.parse(storedMoves);
    }
    this.game = new Chess();
    this.reset(); //Always reseting the game to aviod unexpected behaviour
  }

  static play() {
    this.pause();
    if (this.intervalId) return; // Already playing
    this.intervalId = window.setInterval(() => this.next(), 1000); // Playing the next move every 1000ms
    this.togglePlayPauseButtons(true);
  }

  static pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.togglePlayPauseButtons(false);
    }
  }

  static next() {
    if (this.currentMoveIndex < this.gameMoves.length) {
      //Play the moves as there are still moves remaining
      const move = this.gameMoves[this.currentMoveIndex];

      this.game.move({ from: move.from, to: move.to });
      this.board.position(this.game.fen());
      pieceMove.play();
      this.currentMoveIndex++;
    } else {
      this.reset(); // If all moves are played, reset the game
    }
  }

  static rewind() {
    if (this.currentMoveIndex > 0) {
      this.currentMoveIndex--;
      this.game.undo();
      this.board.position(this.game.fen());
      pieceMove.play();
    }
  }

  static reset() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.game.reset(); // Reset the chess game
    this.board.position(this.game.fen()); // Reset the board position
    this.currentMoveIndex = 0; // Reset the move index
    this.togglePlayPauseButtons(false); // Reset button states
  }

  static togglePlayPauseButtons(isPlaying: boolean) {
    const playBtn = document.getElementById("playBtn") as HTMLButtonElement;
    const pauseBtn = document.getElementById("pauseBtn") as HTMLButtonElement;

    if (isPlaying) {
      playBtn.style.display = "none";
      pauseBtn.style.display = "inline-block";
    } else {
      playBtn.style.display = "inline-block";
      pauseBtn.style.display = "none";
    }
  }
}
