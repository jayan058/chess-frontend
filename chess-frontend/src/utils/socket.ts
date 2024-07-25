import { io, Socket } from 'socket.io-client';
import { Auth } from '../auth';

class SocketSingleton {
    private static instance: SocketSingleton;
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
            (this.socket.auth as any).token = Auth.getAccessToken();
        });
    }

    public static getInstance(): SocketSingleton {
        if (!SocketSingleton.instance) {
            SocketSingleton.instance = new SocketSingleton();
        }

        return SocketSingleton.instance;
    }

    public getSocket(): Socket {
        return this.socket;
    }
}

const socketInstance = SocketSingleton.getInstance();
Object.freeze(socketInstance);

export default socketInstance;
