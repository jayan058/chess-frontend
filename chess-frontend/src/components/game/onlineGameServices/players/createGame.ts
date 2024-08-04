//All the necessary imports
import { Auth } from "../../../../auth";
import { Router } from "../../../../router";
import { ModalManager } from "../../../../utils/modal";
import socketInstance from "../../../../utils/socket";

const socket = socketInstance.getSocket(); //Getting a new socket instance from the SocketSingleton class
export class CreateGamePage {
  static async load(): Promise<string> {
    if (!Auth.isLoggedIn()) {
      window.location.hash = "#/login";
      Router.loadContent();
      return "";
    }
    const response = await fetch("src/views/createGame.html");
    return response.text();
  }

  static initEventListeners() {
    socket.off("randomMatchRequest"); //Removing any previous event listeners that might be present to prevent any unexptected behaviour
    const createRoomForm = document.getElementById(
      "create-room-form",
    ) as HTMLFormElement;
    createRoomForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const roomName = (
        document.getElementById("room-name") as HTMLInputElement
      ).value;

      socket.emit("createRoom", { roomName }); //Event to create a new room

      socket.on("roomCreated", () => {
        //Meesage recieved on successfull room creation
        const modal = new ModalManager("myModal", "modalMessage", "close");
        modal.show("Room Created Successfully Waiting For Opponent", "success");
      });
      socket.on("roomExists", () => {
        //Message recieved if the room with the same name exists
        const modal = new ModalManager("myModal", "modalMessage", "close");
        modal.show("Room Exists", "error");
        window.location.href = "#/create-game";
      });
      const modal = new ModalManager("myModal", "modalMessage", "close");
      socket.on("opponentConnected", () => {
        //If another opponents joins the same rooms then show this message
        modal.show("Opponent Connected Redirecting to Game!!!", "success");
      });
      socket.on("redirectToGame", () => {
        modal.close();
        window.location.href = "#/online"; // Redirect both users to the game page
      });
    });
  }
}
