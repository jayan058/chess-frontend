import { Chess } from 'chess.js';
import { io } from 'socket.io-client';
import { Auth } from '../auth';
const game = new Chess();
const socket = io('http://localhost:3000', {
    transports: ['websocket'], // Optional: Use WebSocket transport
    withCredentials: true,     // Ensure credentials are sent if needed
    auth: {
        token: Auth.getAccessToken() // Send the token in the auth object
    }
});

export class Online {
    static async load(): Promise<string> {
        const response = await fetch("src/views/online.html");
        return response.text();
    }

    static initEventListeners() {
        const board = ChessBoard('board', {
            draggable: true,
            position: 'start',
            onDrop: handleMove,
            onSnapEnd: onSnapEnd,
        });

        socket.on('gameStarted', ({ turn }) => {
            console.log(`Game started. It's ${turn}'s turn.`);
            currentTurn = turn; // Update the turn
        });

        socket.on('turn', (turn) => {
            console.log(`It's now ${turn}'s turn.`);
            updateTurnIndicator(turn);
        });

        socket.on('move', (move) => {
            game.move(move);
            renderBoard();
        });

        socket.on('error', (message) => {
            alert(message);
        });

        let currentTurn = 'w'; 

        function handleMove(source, target) {
            if (currentTurn === getCurrentTurn()) {
                const move = { from: source, to: target };
                game.move(move);
                updateBoard();
                sendMove(move); // Emit the move to the server
            } else {
                return 'snapback';
            }
        }

        function updateBoard() {
            if (board) {
                board.position(game.fen());
            }
        }

        function onSnapEnd() {
            board.position(game.fen());
        }

        function renderBoard() {
            board.position(game.fen());
        }

        function sendMove(move: { from: string, to: string }) {
            socket.emit('move', move); // Send the move object to the server
        }

        function updateTurnIndicator(turn: string) {
            // Update UI to reflect whose turn it is
        }

        function getCurrentTurn(): string {
            // Return the current player's turn (e.g., 'white' or 'black')
            return currentTurn; // Example; implement actual logic based on game state
        }
    }
}
