export interface ReceivedMessage {
  id: number;
  gameId: number;
  roomId: number;
  senderId: number;
  message: string;
  messageType: string | null;
  createdAt: string;
  name: string;
  email: string;
  passwordHash: string;
  profilePicture: string;
  updatedAt: string;
}
