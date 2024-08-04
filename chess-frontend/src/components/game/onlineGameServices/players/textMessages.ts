import socketInstance from "../../../../utils/socket";
import { myData } from "./online";
import { Message } from "../../../../interfaces/messages";

const socket = socketInstance.getSocket();
let newMessageCount = 0;
let newMessage = new Audio();
newMessage.src = "./assets/audio/newMessage.mp3";

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = []; //To store the audio messages once they are available

export function sendTextMessage() {
  //Grabbing all the necessary html elements
  const sendMessageButton = document.querySelector(
    ".send-message",
  ) as HTMLElement;
  const messageInput = document.querySelector(
    ".message-input",
  ) as HTMLInputElement;
  const showMessagesButton = document.querySelector(
    ".show-messages",
  ) as HTMLButtonElement;
  const messageModal = document.querySelector(".modal") as HTMLElement;
  const closeButton = document.querySelector(".close-button") as HTMLElement;
  const startRecordingButton = document.querySelector(
    ".start-recording",
  ) as HTMLElement;
  const stopRecordingButton = document.querySelector(
    ".stop-recording",
  ) as HTMLElement;
  const sendAudioButton = document.querySelector(".send-audio") as HTMLElement;

  if (sendMessageButton && messageInput) {
    sendMessageButton.addEventListener("click", () => {
      const content = messageInput.value.trim();
      if (content) {
        sendMessage(content); // Send message to server
        messageInput.value = ""; // Clear the input field
        scrollToBottom(); // Scroll to bottom after sending a message
      }
    });

    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessageButton.click();
      }
    });
  }

  if (showMessagesButton) {
    showMessagesButton.addEventListener("click", () => {
      messageModal.style.display = "block";
      resetMessageCount();
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
  //Event listeners for the audio message
  if (startRecordingButton && stopRecordingButton && sendAudioButton) {
    startRecordingButton.addEventListener("click", startRecording);
    stopRecordingButton.addEventListener("click", stopRecording);
    sendAudioButton.addEventListener("click", sendAudioMessage);
  }
}

function sendMessage(content: string) {
  const message: Message = {
    sender: myData.myName,
    content: content,
    timestamp: new Date().toISOString(),
    picture: myData.myPicture,
    roomId: myData.myRoom,
  };
  socket.emit("message", message); // Emit the message to the server
}

function startRecording() {
  const startRecordingButton = document.querySelector(
    ".start-recording",
  ) as HTMLElement;
  const stopRecordingButton = document.querySelector(
    ".stop-recording",
  ) as HTMLElement;

  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data); //If the data is available then push it to the audioChunks array
    });

    startRecordingButton.style.display = "none";
    stopRecordingButton.style.display = "inline";
  });
}

function stopRecording() {
  const stopRecordingButton = document.querySelector(
    ".stop-recording",
  ) as HTMLElement;
  const sendAudioButton = document.querySelector(".send-audio") as HTMLElement;

  if (mediaRecorder) {
    mediaRecorder.stop();
    mediaRecorder.addEventListener("stop", () => {
      sendAudioButton.style.display = "inline";
      stopRecordingButton.style.display = "none";
    });
  }
}

function sendAudioMessage() {
  const startRecordingButton = document.querySelector(
    ".start-recording",
  ) as HTMLElement;
  const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
  const reader = new FileReader();
  reader.readAsDataURL(audioBlob);
  reader.onloadend = () => {
    const base64AudioMessage = reader.result;
    const message: Message = {
      sender: myData.myName,
      content: base64AudioMessage as string, //Send the blob url for the audio
      timestamp: new Date().toISOString(),
      picture: myData.myPicture,
      roomId: myData.myRoom,
      isAudio: true,
    };
    socket.emit("message", message); // Emit the audio message to the server
  };

  audioChunks = []; // Clear audio chunks after sending
  const sendAudioButton = document.querySelector(".send-audio") as HTMLElement;
  sendAudioButton.style.display = "none";
  startRecordingButton.style.display = "inline";
}

socket.on("message", (message: Message) => {
  displayMessage(message);

  handleNewMessage(); // Handle new message for notification
  scrollToBottom(); // Scroll to bottom after receiving a new message
  newMessage.play();
});

export function handleNewMessage() {
  const messageModal = document.querySelector(".modal") as HTMLElement;
  if (messageModal.style.display !== "block") {
    newMessageCount++;
    updateMessageButton();
  }
}

function updateMessageButton() {
  const showMessagesButton = document.querySelector(
    ".show-messages",
  ) as HTMLButtonElement;
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
  //Creatr a containor to display the message
  const messageContainer = document.querySelector(".message-container");
  if (messageContainer) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    const messageImageElement = document.createElement("img");
    messageImageElement.src = message.picture;
    messageImageElement.classList.add("message-image");

    const messageTextElement = document.createElement("p");
    messageTextElement.classList.add("message-text");

    //If the message is audio then create a audio element else create a text element
    if (message.isAudio) {
      const audioElement = document.createElement("audio");
      audioElement.controls = true;
      audioElement.src = message.content;
      messageTextElement.appendChild(audioElement);
    } else {
      messageTextElement.innerHTML = `<strong>${message.sender}:</strong> ${message.content}`;
    }
    // Apply Different styles to the messages based on who sent it
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
