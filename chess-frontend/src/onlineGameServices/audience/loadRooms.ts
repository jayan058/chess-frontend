// src/services/loadRooms.ts
import { fetchActiveRooms } from './selectGame';
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
      const roomElement = document.createElement('button');
      roomElement.className = 'active-rooms-list';
      roomElement.textContent = `Room Name: ${room.roomName}`;
      roomsContainer.appendChild(roomElement);
    });
  }
}
