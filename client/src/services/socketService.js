import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.API_URL || 'http://localhost:3000';

class SocketService {
    socket = null;

    connect(userId) {
        if (!this.socket) {
            this.socket = io(SOCKET_URL);
            
            this.socket.on('connect', () => {
                console.log('Socket Connected');
                this.socket.emit('register', userId);
            });
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Generic emit
    emit(eventName, data) {
        if (this.socket) {
            this.socket.emit(eventName, data);
        }
    }

    // Generic listener
    on(eventName, callback) {
        if (this.socket) {
            this.socket.on(eventName, callback);
        }
    }

    off(eventName) {
        if (this.socket) {
            this.socket.off(eventName);
        }
    }
}

export default new SocketService();