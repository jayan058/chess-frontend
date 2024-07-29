const socket = socketInstance.getSocket();
import socketInstance from "../../utils/socket";
import { myData } from "./online";

import { Message } from "../../interfaces/messages";


export function messageSend(){
const sendMessageButton = document.getElementById("send-message");
const messageInput = document.getElementById(
  "message-input"
) as HTMLInputElement;
if (sendMessageButton && messageInput) {
  sendMessageButton.addEventListener("click", () => {
    const content = messageInput.value.trim();
    if (content) {
      sendMessage(content); // Send message to server
      messageInput.value = ""; // Clear the input field
    }
  });

  // Optional: Send message on Enter key press
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessageButton.click();
    }
  });
}

}
function sendMessage(content: string) {
  
    console.log(myData);
    
    const message: Message = {
      sender: myData.myName,
      content: content,
      timestamp: Date.now(),
      picture:myData.myPicture,
      roomId:myData.myRoom
    };
    socket.emit("message", message); // Emit the message to the server
  }
  

  socket.on("message", (message: Message) => {
    console.log("Message received:", message);
   displayMessage(message);
  });  


  function displayMessage(message: Message) {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");
      messageElement.innerHTML = `<strong>${message.sender}:</strong> ${message.content} <small>${new Date(message.timestamp).toLocaleTimeString()}</small>`;
      messageContainer.appendChild(messageElement);
    }

}