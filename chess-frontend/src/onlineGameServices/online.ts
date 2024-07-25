import { Chess } from 'chess.js';
import { io } from 'socket.io-client';
import { Auth } from '../auth';
import socketInstance from '../utils/socket';

const socket = socketInstance.getSocket();

export class Online {
    private static game: Chess;
    private static board: any; // Replace 'any' with the actual type if known
    private static currentTurn: string = 'w';

    static async load(): Promise<string> {
        const response = await fetch("src/views/online.html");
        return response.text();
    }

    static initEventListeners() {

        // Ensure a new Chess instance is created for each game
        this.game = new Chess();
        this.board = ChessBoard('board', {
            draggable: true,
            position: 'start',
            onDrop: this.handleMove.bind(this),
            onSnapEnd: this.onSnapEnd.bind(this),
        });

        // Clear previous event handlers if any
        socket.off('gameStarted');
        socket.off('turn');
        socket.off('move');
        socket.off('error');

        // Set up event handlers
        socket.on('gameStarted', ({ turn }) => {
            console.log(`Game started. It's ${turn}'s turn.`);
            this.currentTurn = turn; // Update the turn
            this.game.reset(); // Reset the Chess instance
            this.board.position('start'); // Reset board position
        });

        socket.on('turn', (turn) => {
            console.log(`It's now ${turn}'s turn.`);
            this.updateTurnIndicator(turn);
        });

        socket.on('move', (move) => {
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

        socket.on('error', (message) => {
            alert(message);
        });
       
      
          // Handle navigation
      
    }

    private static handleMove(source: string, target: string) {
        console.log('Handling move:', { source, target });
        console.log('Current FEN:', this.game.fen());

        if (this.currentTurn === this.getCurrentTurn()) {
            const move = { from: source, to: target };
            const result = this.game.move(move);
            if (result) {
                console.log('New FEN after move:', this.game.fen());
                this.updateBoard();
                this.sendMove(move); // Emit the move to the server
            } else {
                console.warn('Invalid move attempted:', move);
                return 'snapback';
            }
        } else {
            return 'snapback';
        }
    }

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

    private static sendMove(move: { from: string, to: string }) {
        socket.emit('move', move); // Send the move object to the server
    }

    private static updateTurnIndicator(turn: string) {
        // Update UI to reflect whose turn it is
        console.log(`Turn indicator updated to: ${turn}`);
    }

    private static getCurrentTurn(): string {
        // Return the current player's turn (e.g., 'white' or 'black')
        return this.currentTurn; // Example; implement actual logic based on game state
    }
}



