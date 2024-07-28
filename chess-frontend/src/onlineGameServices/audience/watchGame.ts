import { loadActiveRooms } from "./loadRooms";
import socketInstance from "../../utils/socket";
const socket = socketInstance.getSocket();

export class WatchGame {
  static async load(): Promise<string> {
    const response = await fetch("src/views/watchGame.html");
    return response.text();
  }

  static initEventListeners() { 
    console.log("Initializing event listeners");
    
    socket.off("watchGame"); // Clear previous 'watchGame' event
    loadActiveRooms(); // Load and render rooms
  }
}
