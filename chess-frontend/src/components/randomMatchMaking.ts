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
        modal.show("Finding An Opponent For You Hang In There", "success");
        let opponentFindInterval=setInterval(()=>{
           socket.emit("randomMatchRequest");
        },3000)
       
        socket.on("opponentConnected", () => {
          clearInterval(opponentFindInterval)
            modal.show("We Found An Opponent For You!!!Redirecting to Game!!!", "success");
          });
          socket.on("redirectToGame", () => {
            modal.close();
            window.location.href = "#/online"; // Redirect both users to the game page
          });

    }
  }