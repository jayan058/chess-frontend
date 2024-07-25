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

export class JoinGame{
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
    const createRoomForm = document.getElementById('join-room-form') as HTMLFormElement;
    createRoomForm.addEventListener('submit', (event) => {
      event.preventDefault();
     
      const roomName = (document.getElementById('room-name') as HTMLInputElement).value;

      socket.emit('joinRoom', { roomName });
      socket.on('joinRoomError', (response) => {
        const modal = new ModalManager("myModal", "modalMessage", "close");
        modal.show(response.message, "error");
      });
      socket.on('opponentConnected', () => {
        //Create Modal do display who is playing who like in the professional games
      });
      socket.on('redirectToGame', () => {
        window.location.href = '#/game'; // Redirect both users to the game page
      });
        
    });
  }
}
