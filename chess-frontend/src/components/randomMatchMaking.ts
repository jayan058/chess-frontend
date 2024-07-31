import socketInstance from "../utils/socket";

const socket = socketInstance.getSocket();
import { ModalManager } from "../utils/modal";

export class RandomMatchMaking {
    static async load(): Promise<string> {
      const response = await fetch("src/views/randomMatchMaking.html");
      return response.text();
    }
  
    static initEventListeners() {
        const modal = new ModalManager("myModal", "modalMessage", "close");

        socket.emit("randomMatchRequest");
        socket.on("opponentConnected", () => {
            modal.show("Opponent Connected Redirecting to Game!!!", "success");
          });
          socket.on("redirectToGame", () => {
            modal.close();
            window.location.href = "#/online"; // Redirect both users to the game page
          });

    }
  }