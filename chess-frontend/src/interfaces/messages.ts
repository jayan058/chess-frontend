export interface Message {
  sender: string;
  content: string;
  timestamp: string;
  picture: string;
  roomId?: number;
  isAudio?: boolean;
}
