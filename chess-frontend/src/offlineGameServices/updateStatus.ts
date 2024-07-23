

import { game } from "../eventListeners/offline";
import { modal } from "../eventListeners/offline";
export var updateStatus = function () {
    let status = "";
    console.log("Show");

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