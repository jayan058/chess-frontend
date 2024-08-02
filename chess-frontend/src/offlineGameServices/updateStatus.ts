import { game } from "../components/offline";
import { modal } from "../components/offline";
export let updateStatus = function () {
  let status = "";

  if (game.in_checkmate()) {
    status =
      "Checkmate! " + (game.turn() === "w" ? "Black" : "White") + " wins.";
    modal.show(status, []);
  } else if (game.in_draw()) {
    status = "Draw!";
  } else {
    status = "AI IS THINKING";
    game.turn() === "b" ? modal.show(status, []) : null;
    if (game.in_check()) {
      status = "Check Mate!";
      modal.show(status, []);
    }
  }

  setTimeout(() => {
    modal.hide();
  }, 2000);
};
