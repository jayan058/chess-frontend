// src/pages/createGame.ts
import { Auth } from "../../auth";
import { Router } from "../../router";
import { ModalManager } from "../../utils/modal";

import socketInstance from "../../utils/socket";

const socket = socketInstance.getSocket();

export class JoinGame {
  static async load(): Promise<string> {
    if (!Auth.isLoggedIn()) {
      window.location.hash = "#/login";
      Router.loadContent();
      return "";
    }
    const response = await fetch("src/views/joinGame.html");
    return response.text();
  }

  static initEventListeners() {
    const createRoomForm = document.getElementById(
      "join-room-form"
    ) as HTMLFormElement;
    createRoomForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const roomName = (
        document.getElementById("room-name") as HTMLInputElement
      ).value;

      socket.emit("joinRoom", { roomName });
      socket.on("joinRoomError", (response) => {
        const modal = new ModalManager("myModal", "modalMessage", "close");
        modal.show(response.message, "error");
      });
      const modal = new ModalManager("myModal", "modalMessage", "close");
      socket.on("opponentConnected", () => {
        modal.show("Opponent Connected Redirecting to Game!!!", "success");
      });
      socket.on("redirectToGame", () => {
        modal.close();
        window.location.href = "#/online"; // Redirect both users to the game page
      });
    });
  }
}
