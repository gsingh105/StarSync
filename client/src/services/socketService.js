import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class SocketService {
    socket = null;

    connect(userId) {
        if (!this.socket) {
            this.socket = io(SOCKET_URL, {
                transports: ['websocket'], 
                withCredentials: true,
                autoConnect: true
            });
            
            this.socket.on('connect', () => {
                // console.log('Socket Connected with ID:', this.socket.id);
                // Registering the user/astrologer so the backend knows who is who
                this.socket.emit('register', userId);
            });

            this.socket.on('connect_error', (err) => {
                console.error('Socket Connection Error:', err.message);
            });
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    emit(eventName, data) {
        if (this.socket && this.socket.connected) {
            this.socket.emit(eventName, data);
        } else {
            console.warn(`Socket not connected. Cannot emit: ${eventName}`);
        }
    }

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