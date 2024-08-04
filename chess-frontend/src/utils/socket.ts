//All the necessary imports
import { io, Socket } from "socket.io-client";
import { Auth } from "../auth";
import { ModalManager } from "./modal";

//Class to handle all of the socket functions like connect,disconnect,reconnect,getting access token and refreshing the access token
class SocketSingleton {
  private static instance: SocketSingleton | null = null;
  public socket: Socket;

  //Create a new socket instance
  private constructor() {
    this.socket = io("http://localhost:3000", {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token: Auth.getAccessToken(), //Set the access token as auth in the socket instance
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
    this.socket.disconnect(); //Disconnect the socket connection
  }

  public async reconnect() {
    await this.updateAuthToken(); //During every reconnection get a press access token
    this.socket.connect();
  }

  private async updateAuthToken() {
    try {
      const newToken = await Auth.refreshAccessToken(); //Refresh the access token during every reconnection
      this.socket.auth = {
        token: newToken, //Update the token  in the socket instance with the new access token
      };
    } catch (error) {
      const modal = new ModalManager("myModal", "modalMessage", "close");
      modal.show("Session Expired Login Again", "error"); //Unable to refresh the access token
      setTimeout(() => {
        window.location.hash = "#/login";
      }, 3000);
    }
  }
}

const socketInstance = SocketSingleton.getInstance(); //Create a new socket instance
Object.freeze(socketInstance);

export default socketInstance;
