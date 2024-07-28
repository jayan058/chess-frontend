// src/services/loadRooms.ts
import { fetchActiveRooms } from './selectGame'; 

export const roomElement = document.createElement('button');
export async function loadActiveRooms() {
  try {
    const rooms = await fetchActiveRooms();
    console.log(rooms);
    renderRooms(rooms);
  } catch (error) {
    console.error('Error loading rooms:', error);
  }
}

function renderRooms(rooms: { roomName: string }[]): void {
  const roomsContainer = document.getElementById('container');
  if (roomsContainer) {
    rooms.forEach(room => {
       roomElement.className = 'active-rooms-list';
      roomElement.textContent = `${room.roomName}`;
      roomsContainer.appendChild(roomElement);
    });
  }
}
