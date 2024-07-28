// src/eventListeners/home.ts

import { Chess } from "chess.js";

import { loadActiveRooms } from './loadRooms';
import { roomElement } from './loadRooms';
import socketInstance from "../../utils/socket";
const socket = socketInstance.getSocket();

export class WatchGame {
  private static game: Chess;
  private static board: any;
  static async load(): Promise<string> {
    const response = await fetch('src/views/watchGame.html');
    return response.text();
  }

  static initEventListeners() {
     loadActiveRooms();
     roomElement.addEventListener('click', () => {
      
      console.log(roomElement.innerText);
      
      // Emit the 'watchGame' event to the server
      socket.emit('watchGame',roomElement.innerText);
      this.board = ChessBoard("board", {
        draggable: false,
        position: "start"
      });
      this.game = new Chess();
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
     

  })
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
