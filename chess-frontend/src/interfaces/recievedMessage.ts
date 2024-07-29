export interface ReceivedMessage {
    id: number;
    gameId: number;
    roomId: number;
    senderId: number;
    message: string;
    messageType: string | null;
    createdAt: string; // Use string if the timestamp is in ISO format
    name: string;
    email: string;
    passwordHash: string;
    profilePicture: string;
    updatedAt: string; // Use string if the timestamp is in ISO format
  }
  