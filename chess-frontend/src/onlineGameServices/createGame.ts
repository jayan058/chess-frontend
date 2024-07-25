// src/pages/createGame.ts
import { Auth } from "../auth";
import { Router } from "../router";
import { ModalManager } from "../utils/modal";
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket'], // Optional: Use WebSocket transport
  withCredentials: true,     // Ensure credentials are sent if needed
  auth: {
    token: Auth.getAccessToken() // Send the token in the auth object
  }
});

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
    const createRoomForm = document.getElementById('create-room-form') as HTMLFormElement;
    createRoomForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const roomName = (document.getElementById('room-name') as HTMLInputElement).value;

    
        socket.emit('createRoom', { roomName });
        socket.on('roomCreated', () => {
          const modal = new ModalManager("myModal", "modalMessage", "close");

          modal.show("Room Created Successfully", "success");
          window.location.href = '#/waiting-for-opponent'; // Redirect to waiting page
        });
        socket.on('roomExists', () => {
          const modal = new ModalManager("myModal", "modalMessage", "close");

          modal.show("Room Exists", "error");
          window.location.href = '#/create-game'; // Redirect to waiting page
        });
     
        
    });
  }
}
