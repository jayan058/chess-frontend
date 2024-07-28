// src/eventListeners/home.ts
import { loadActiveRooms } from "./loadRooms";
import { roomElement } from "./loadRooms";
import socketInstance from "../../utils/socket";
const socket = socketInstance.getSocket();

export class WatchGame {
  static async load(): Promise<string> {
    const response = await fetch("src/views/watchGame.html");
    return response.text();
  }

  static initEventListeners() {
    loadActiveRooms();
    roomElement.addEventListener("click", () => {
      console.log(roomElement.innerText);
     
      // Emit the 'watchGame' event to the server
      socket.emit("watchGame", roomElement.innerText);
      window.location.hash="#/online-audience-page"
    })
  }
}
