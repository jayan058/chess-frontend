import { ChessAlertModal } from "../modals/chessAlertModal";
import { updateStatus } from "./updateStatus";
export function initializeGameControls(game: any, board: any) {
  // Initialize the modal
  const modal = new ChessAlertModal();

  // Pause functionality
  document.getElementById("pauseBtn")!.addEventListener("click", () => {
    modal.show("Game paused.", [
      { text: "Resume", onClick: () => resumeGame() },
      { text: "Abort", onClick: () => abortGame() },
    ]);
  });

  // Restart functionality
  document.getElementById("restartBtn")!.addEventListener("click", () => {
    game.reset(); // Make sure `game` object has a reset method or reinitialize it
    board.position("start");
    updateStatus();
  });

  // Abort functionality
  document.getElementById("abortBtn")!.addEventListener("click", () => {
    modal.show("ARE YOU SURE?", [
      { text: "CONFIRM ABORT", onClick: () => abortGame() },
      { text: "BACK TO GAME", onClick: () => modal.hide() },
    ]);
  });

  function resumeGame() {
    modal.hide();
    // Add logic to resume the game
  }

  function abortGame() {
    modal.hide();
    window.location.hash = "#/welcome";
  }
}
