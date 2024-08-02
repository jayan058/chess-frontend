export interface PlayerInfo {
  myColor: string;
  myName: string;
  myPicture: string;
  myRoom: number;
  otherParticipants: Array<{
    color: string;
    name: string;
    picture: string;
  }>;
}
