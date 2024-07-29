import { Message } from "../../interfaces/messages";
import { displayMessage } from "../players/textMessages";
import { ReceivedMessage } from "../../interfaces/recievedMessage";
export  function transformMessages(message:ReceivedMessage) {
   

  
    const transformedMessages:Message={
      sender: message.name,
      content: message.message,
      timestamp: message.createdAt,
      picture: message.profilePicture,
    };

    console.log(transformedMessages);
    
    // Display the messages
    displayMessage(transformedMessages);
  }