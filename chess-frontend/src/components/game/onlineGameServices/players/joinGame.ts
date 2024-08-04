//All the necessary imports
import { Auth } from "../../../../auth";
import { Router } from "../../../../router";
import { ModalManager } from "../../../../utils/modal";
import socketInstance from "../../../../utils/socket";

const socket = socketInstance.getSocket(); //Getting a new socket instance from

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
    socket.off("randomMatchRequest"); //Removing any previous event listeners that might be present to prevent any unexptected behaviour

    const createRoomForm = document.getElementById(
      "join-room-form",
    ) as HTMLFormElement;
    createRoomForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const roomName = (
        document.getElementById("room-name") as HTMLInputElement
      ).value;

      socket.emit("joinRoom", { roomName }); //Requesting to join a room
      socket.on("joinRoomError", (response) => {
        //Message shown if two people are already in the room
        const modal = new ModalManager("myModal", "modalMessage", "close");
        modal.show(response.message, "error");
      });
      const modal = new ModalManager("myModal", "modalMessage", "close");
      socket.on("opponentConnected", () => {
        //Message shown on successfull room joining
        modal.show("Opponent Connected Redirecting to Game!!!", "success");
      });
      socket.on("redirectToGame", () => {
        modal.close();
        window.location.href = "#/online"; // Redirect both users to the game page
      });
    });
  }
}
