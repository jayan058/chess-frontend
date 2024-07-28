// src/eventListeners/home.ts
import { loadActiveRooms } from './loadRooms';

export class WatchGame {
  static async load(): Promise<string> {
    const response = await fetch('src/views/watchGame.html');
    return response.text();
  }

  static initEventListeners() {
    
    
     loadActiveRooms();
  }
}
