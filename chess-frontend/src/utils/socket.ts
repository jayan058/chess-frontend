import { io, Socket } from "socket.io-client";
import { Auth } from "../auth";
import { ModalManager } from "./modal";
class SocketSingleton {
  private static instance: SocketSingleton | null = null;
  public socket: Socket;

  private constructor() {
    this.socket = io("http://localhost:3000", {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token: Auth.getAccessToken(),
      },
    });

    this.socket.on("reconnect_attempt", async () => {
      await this.updateAuthToken();
      this.socket.connect();
    });
  }

  public static getInstance(): SocketSingleton {
    if (!SocketSingleton.instance) {
      SocketSingleton.instance = new SocketSingleton();
    }

    return SocketSingleton.instance;
  }

  public static destroyInstance() {
    if (SocketSingleton.instance) {
      SocketSingleton.instance.socket.disconnect();
      SocketSingleton.instance.socket.off();
      SocketSingleton.instance = null;
    }
  }

  public getSocket(): Socket {
    return this.socket;
  }

  public disconnect() {
    this.socket.disconnect();
  }

  public async reconnect() {
    await this.updateAuthToken();
    this.socket.connect();
  }

  private async updateAuthToken() {
    try {
      const newToken = await Auth.refreshAccessToken();
      this.socket.auth = {
        token: newToken,
      };
    } catch (error) {
      const modal = new ModalManager("myModal", "modalMessage", "close");
      modal.show("Session Expired Login Again", "error");
      setTimeout(()=>{
         window.location.hash="#/login" 
      },3000)
    
    }
  }
}

const socketInstance = SocketSingleton.getInstance();
Object.freeze(socketInstance);

export default socketInstance;
