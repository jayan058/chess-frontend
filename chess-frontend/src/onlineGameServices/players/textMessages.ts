import socketInstance from "../../utils/socket";
import { myData } from "./online";
import { Message } from "../../interfaces/messages";

const socket = socketInstance.getSocket();

export function sendTextMessage() {
  const sendMessageButton = document.querySelector(".send-message") as HTMLButtonElement;
  const messageInput = document.querySelector(".message-input") as HTMLInputElement;

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

  const showMessagesButton = document.querySelector(".show-messages") as HTMLButtonElement;
  const messageModal = document.querySelector(".modal") as HTMLElement;
  const closeButton = document.querySelector(".close-button") as HTMLElement;

  if (showMessagesButton) {
    showMessagesButton.addEventListener("click", () => {
      messageModal.style.display = "block";
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      messageModal.style.display = "none";
    });
  }
  if (messageModal) {
    messageModal.addEventListener("click", (event) => {
      if (event.target === messageModal) {
        messageModal.style.display = "none";
      }
    });
  }
}

function sendMessage(content: string) {
  const message: Message = {
    sender: myData.myName,
    content: content,
    timestamp: new Date().toISOString(),
    picture: myData.myPicture,
    roomId: myData.myRoom
  };
  socket.emit("message", message); // Emit the message to the server
}

socket.on("message", (message: Message) => {
  console.log("Message received:", message);
  displayMessage(message);
});

// Function to display messages
export function displayMessage(message: Message) {
  const messageContainer = document.querySelector(".message-container");
  if (messageContainer) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    const messageImageElement = document.createElement("img");
    messageImageElement.src = message.picture;
    messageImageElement.classList.add("message-image");

    const messageTextElement = document.createElement("p");
    messageTextElement.classList.add("message-text");
    messageTextElement.innerHTML = `<strong>${message.sender}:</strong> ${message.content}`;

    // Apply different styles for sent and received messages
    if (message.sender === myData.myName) {
      messageElement.classList.add("sent-message");
    } else {
      messageElement.classList.add("received-message");
    }

    messageElement.appendChild(messageImageElement);
    messageElement.appendChild(messageTextElement);
    messageContainer.appendChild(messageElement);
  }
}

