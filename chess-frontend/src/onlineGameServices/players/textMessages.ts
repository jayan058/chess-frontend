import socketInstance from "../../utils/socket";
import { myData } from "./online";
import { Message } from "../../interfaces/messages";

const socket = socketInstance.getSocket();
let newMessageCount = 0;
let newMessage=new Audio()
newMessage.src="./assets/audio/newMessage.mp3"
export function sendTextMessage() {
  const sendMessageButton = document.querySelector(".send-message") as HTMLButtonElement;
  const messageInput = document.querySelector(".message-input") as HTMLInputElement;
  const showMessagesButton = document.querySelector(".show-messages") as HTMLButtonElement;
  const messageModal = document.querySelector(".modal") as HTMLElement;
  const closeButton = document.querySelector(".close-button") as HTMLElement;

  if (sendMessageButton && messageInput) {
    sendMessageButton.addEventListener("click", () => {
      const content = messageInput.value.trim();
      if (content) {
        sendMessage(content); // Send message to server
        messageInput.value = ""; // Clear the input field
        scrollToBottom(); // Scroll to bottom after sending a message
      }
    });

    // Optional: Send message on Enter key press
    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessageButton.click();
      }
    });
  }

  if (showMessagesButton) {
    showMessagesButton.addEventListener("click", () => {
      messageModal.style.display = "block";
      resetMessageCount(); // Reset new message count
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

  handleNewMessage(); // Handle new message for notification
  scrollToBottom(); // Scroll to bottom after receiving a new message
  newMessage.play()
});

export function handleNewMessage() {
  const messageModal = document.querySelector(".modal") as HTMLElement;
  if (messageModal.style.display !== "block") {
    newMessageCount++;
    updateMessageButton();
  }
}

function updateMessageButton() {
  const showMessagesButton = document.querySelector(".show-messages") as HTMLButtonElement;
  if (showMessagesButton) {
    if (newMessageCount > 0) {
      showMessagesButton.textContent = `Show Messages (New Messages)`;
      showMessagesButton.style.backgroundColor = "red"; // Change color for new messages
    } else {
      showMessagesButton.textContent = "Show Messages";
      showMessagesButton.style.backgroundColor = ""; // Reset color
    }
  }
}

function resetMessageCount() {
  newMessageCount = 0;
  updateMessageButton();
}

// Function to scroll to the bottom of the message container
export function scrollToBottom() {
  const messageContainer = document.querySelector(".message-container");
  if (messageContainer) {
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
}

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

    scrollToBottom(); // Scroll to bottom after adding a new message to the container
  }
}
