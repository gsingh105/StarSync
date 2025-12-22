import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/db.config.js";
import app from "./src/app.js";
import { setupSocketIO } from "./src/sockets/socketManager.js"; 

const PORT = process.env.PORT || 8000;
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: [
            "http://localhost:5173", 
            "http://localhost:3000"
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});


setupSocketIO(io);

const startServer = async () => {
    try {
        await connectDB();
        httpServer.listen(PORT, () => {
            console.log(`Server running at PORT: ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();