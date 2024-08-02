import socketInstance from "../utils/socket";
const socket = socketInstance.getSocket();
import { ModalManager } from "../utils/modal";
import { Auth } from "../auth";
import { Router } from "../router";

export class RandomMatchMaking {
  static opponentFindInterval: number | undefined;

  static async load(): Promise<string> {
    if (!Auth.isLoggedIn()) {
      window.location.hash = "#/login";
      Router.loadContent();
      return "";
    }
    const response = await fetch("src/views/randomMatchMaking.html");
    return response.text();
  }

  static initEventListeners() {
    const modal = new ModalManager("myModal", "modalMessage", "close");
    modal.show("Finding An Opponent For You Hang In There", "success");

    // Start finding opponent
    this.startFindingOpponent();

    socket.on("opponentConnected", RandomMatchMaking.handleOpponentConnected);
    socket.on("redirectToGame", RandomMatchMaking.handleRedirectToGame);
    socket.on("foundOpponent", RandomMatchMaking.handleFoundOpponent);

    // Clear the interval when leaving the page
    window.onbeforeunload = () => {
      RandomMatchMaking.cleanup();
    };

    window.addEventListener("hashchange", () => {
      RandomMatchMaking.cleanup();
    });
  }

  static startFindingOpponent() {
    this.opponentFindInterval = setInterval(() => {
      socket.emit("randomMatchRequest");
    }, 3000);
  }

  static stopFindingOpponent() {
    if (this.opponentFindInterval) {
      clearInterval(this.opponentFindInterval);
      this.opponentFindInterval = undefined;
    }
  }

  static handleOpponentConnected() {
    const modal = new ModalManager("myModal", "modalMessage", "close");
    modal.show(
      "We Found An Opponent For You!!! Redirecting to Game!!!",
      "success",
    );
  }

  static handleRedirectToGame() {
    const modal = new ModalManager("myModal", "modalMessage", "close");
    modal.close();
    window.location.href = "#/online";
  }

  static handleFoundOpponent() {
    RandomMatchMaking.stopFindingOpponent();
  }

  static cleanup() {
    RandomMatchMaking.stopFindingOpponent();
    socket.off("opponentConnected", RandomMatchMaking.handleOpponentConnected);
    socket.off("redirectToGame", RandomMatchMaking.handleRedirectToGame);
    socket.off("foundOpponent", RandomMatchMaking.handleFoundOpponent);
  }
}
