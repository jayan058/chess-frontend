import { fetchActiveRooms } from "./selectGame";
import socketInstance from "../../../../utils/socket";
export async function loadActiveRooms() {
  try {
    const rooms = await fetchActiveRooms();
    renderRooms(rooms);
  } catch (error) {
    console.error("Error loading rooms:", error);
  }
}

function renderRooms(rooms: { roomName: string }[]): void {
  const roomsContainer = document.getElementById("container");
  if (roomsContainer) {
    roomsContainer.innerHTML = ""; // Clear previous rooms

    rooms.forEach((room) => {
      const roomElement = document.createElement("button"); // Create a new element for each room
      roomElement.className = "active-rooms-list";
      roomElement.textContent = `${room.roomName}`;
      roomElement.addEventListener("click", () => {
        const socket = socketInstance.getSocket();
        socket.emit("watchGame", room.roomName);
        window.location.hash = "#/online-audience-page";
      });
      roomsContainer.appendChild(roomElement);
    });
  }
}