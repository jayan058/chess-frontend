export interface PlayerInfo {
    myColor: string;
    myId: number;
    otherParticipants: Array<{
      color: string;
      userId: number;
    }>;
  }