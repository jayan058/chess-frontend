import { loadActiveRooms } from "./loadRooms";
import socketInstance from "../../../../utils/socket";
import { Auth } from "../../../../auth";
import { Router } from "../../../../router";
const socket = socketInstance.getSocket();

export class WatchGame {
  static async load(): Promise<string> {
    if (!Auth.isLoggedIn()) {
      window.location.hash = "#/login";
      Router.loadContent();
      return "";
    }
    const response = await fetch("src/views/watchGame.html");
    return response.text();
  }

  static async initEventListeners() {
    socket.off("watchGame"); // Clear previous 'watchGame' event
    loadActiveRooms(); // Load and render rooms
  }
}
