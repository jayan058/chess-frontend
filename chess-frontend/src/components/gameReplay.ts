import { Chess } from "chess.js";

export class GameReplay {
    private static game: Chess;
    private static board: any;
    private static gameMoves: { from: string, to: string }[] = [];
    private static currentMoveIndex: number = 0;
    private static intervalId: number | null = null;

    static async load(): Promise<string> {
        const response = await fetch("src/views/gameReplay.html");
        return response.text();
    }

    static initEventListeners() {
        this.board = ChessBoard("board", {
            draggable: false,
            position: "start",
        });

        // Add control buttons
        document.getElementById("playBtn")?.addEventListener("click", () => this.play());
        document.getElementById("pauseBtn")?.addEventListener("click", () => this.pause());
        document.getElementById("nextBtn")?.addEventListener("click", () => this.next());
        document.getElementById("rewindBtn")?.addEventListener("click", () => this.rewind());
        document.getElementById("resetBtn")?.addEventListener("click", () => this.reset()); // Add reset button listener

        // Retrieve moves from localStorage
        const storedMoves = localStorage.getItem("moves");
        if (storedMoves) {
            this.gameMoves = JSON.parse(storedMoves);
        }

        // Initialize Chess.js game
        this.game = new Chess();

        // Reset the game to start from the beginning
        this.reset();
    }

    static play() {
        console.log("Play button clicked");

        // Clear any existing interval
        this.pause();

        if (this.intervalId) return; // Already playing

        this.intervalId = window.setInterval(() => this.next(), 1000); // Play moves every second
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
            const move = this.gameMoves[this.currentMoveIndex];
            console.log("Applying move:", move);

            this.game.move({ from: move.from, to: move.to });
            this.board.position(this.game.fen());
            this.currentMoveIndex++;
        } else {
            // If all moves are played, reset the game
            this.reset();
        }
    }

    static rewind() {
        if (this.currentMoveIndex > 0) {
            this.currentMoveIndex--;
            this.game.undo();
            this.board.position(this.game.fen());
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

        console.log("Game reset");
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
