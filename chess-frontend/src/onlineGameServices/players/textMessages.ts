const socket = socketInstance.getSocket();
import socketInstance from "../../utils/socket";
import { myData } from "./online";

import { Message } from "../../interfaces/messages";


export function sendTextMessage(){
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
      timestamp: new Date().toISOString(),
      picture:myData.myPicture,
      roomId:myData.myRoom
    };
    socket.emit("message", message); // Emit the message to the server
  }


  socket.on("message", (message: Message) => {
    console.log("Message received:", message);
    displayMessage(message);
  });
  
  // Function to display messages
  export function displayMessage(message: Message) {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
        const messageElement = document.createElement("div");
        const messageImageElement = document.createElement("img");
        messageElement.classList.add("message");
        messageImageElement.src = `${message.picture}`;
        messageElement.innerHTML = `<strong>${message.sender}:</strong> ${
          message.content
        }`;
        messageContainer.appendChild(messageElement);
        messageContainer.appendChild(messageImageElement);
      
  
      messageContainer.appendChild(messageElement);
    }
  }
  
  



