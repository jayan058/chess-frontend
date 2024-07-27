import { io, Socket } from 'socket.io-client';
import { Auth } from '../auth';

class SocketSingleton {
    private static instance: SocketSingleton | null = null;
    public socket: Socket;

    private constructor() {
        this.socket = io('http://localhost:3000', {
            transports: ['websocket'],
            withCredentials: true,
            auth: {
                token: Auth.getAccessToken()
            }
        });
        

        // Handle reconnection
        this.socket.on('reconnect_attempt', () => {
            console.log('Reconnection attempt detected. Updating socket auth token...');
            this.updateAuthToken();
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
            SocketSingleton.instance.socket.off(); // Remove all listeners
            SocketSingleton.instance = null;
        }
    }

    public getSocket(): Socket {
        return this.socket;
    }

    public disconnect() {
        this.socket.disconnect();
    }

    public reconnect() {
        this.updateAuthToken();
        this.socket.connect();
    }

    private updateAuthToken() {
        this.socket.auth = {
            token: Auth.getAccessToken()
        };
    }
}

const socketInstance = SocketSingleton.getInstance();
Object.freeze(socketInstance);

export default socketInstance;
