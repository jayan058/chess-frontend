import { ChessAlertModal } from "../../../modals/chessAlertModal";
import { updateStatus } from "./updateStatus";

//Function to initialize the game controls(play,pause,abort,restart)
export function initializeGameControls(game: any, board: any) {
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
    game.reset();
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

  //Function to resume the game
  function resumeGame() {
    modal.hide();
  }

  function abortGame() {
    modal.hide();
    window.location.hash = "#/welcome";
  }
}
