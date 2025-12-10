import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import { createServer } from "http" 
import { Server } from "socket.io" 
import connectDB from "./src/config/db.config.js"
import { errorHandler } from "./src/utils/errorHanlder.js"
import userRoutes from "./src/routes/auth.routes.js"
import astrologerRoutes from "./src/routes/astrologer.routes.js"
import sessionRoutes from "./src/routes/session.routes.js"
import { createToken } from "./src/config/livekit.js" 

const app = express()
const httpServer = createServer(app); // Wrap Express

const PORT = process.env.PORT || 3000

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// --- SOCKET.IO SETUP ---
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const onlineUsers = new Map(); // Map<userId, socketId>

io.on("connection", (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    // 1. Register
    socket.on("register", (userId) => {
        if(userId) onlineUsers.set(userId, socket.id);
    });

    // 2. Call Request
    socket.on("call_request", (data) => {
        const { callerId, callerName, receiverId } = data;
        const receiverSocketId = onlineUsers.get(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("incoming_call", {
                callerId,
                callerName,
                roomId: `room-${callerId}-${receiverId}`
            });
        } else {
            socket.emit("call_failed", { message: "Astrologer is offline" });
        }
    });

    // 3. Accept Call
    socket.on("accept_call", (data) => {
        const { callerId, receiverId, roomId } = data;
        const callerSocketId = onlineUsers.get(callerId);
        const receiverSocketId = onlineUsers.get(receiverId);

        if (callerSocketId && receiverSocketId) {
            try {
                // Generate Tokens (Synchronous)
                const tokenCaller = createToken(callerId, roomId);
                const tokenReceiver = createToken(receiverId, roomId);

                // Send to User
                io.to(callerSocketId).emit("call_accepted", { roomId, token: tokenCaller });
                // Send to Astrologer
                io.to(receiverSocketId).emit("call_accepted", { roomId, token: tokenReceiver });

            } catch (err) {
                console.error("Token Error:", err);
            }
        }
    });

    // 4. Reject Call
    socket.on("reject_call", (data) => {
        const callerSocketId = onlineUsers.get(data.callerId);
        if (callerSocketId) io.to(callerSocketId).emit("call_rejected");
    });

    socket.on("disconnect", () => {
        for (const [key, value] of onlineUsers.entries()) {
            if (value === socket.id) {
                onlineUsers.delete(key);
                break;
            }
        }
    });
});

app.use("/api/auth", userRoutes)
app.use("/api/astrologer", astrologerRoutes)
app.use("/session", sessionRoutes);
app.use(errorHandler)

httpServer.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running at PORT:${PORT}`)
});