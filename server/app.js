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
import { findUserById } from "./src/dao/auth.dao.js"

const app = express()
const httpServer = createServer(app); 

const PORT = process.env.PORT || 3000

// Allowed Origins
const allowedOrigins = [
    "http://localhost:5173", 
    "http://localhost:3000"
];

const corsOptions = {
    origin: allowedOrigins,
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
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
    socket.on("register", (userId) => {
        if(userId) {
            onlineUsers.set(userId, socket.id);
            // console.log(`User registered: ${userId}`);
        }
    });

    // 2. Call Request
    socket.on("call_request", (data) => {
        const { callerId, callerName, receiverId } = data;
        const receiverSocketId = onlineUsers.get(receiverId);

        // console.log(`Call Request: ${callerId} (${callerName}) -> ${receiverId}`);

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

    socket.on("accept_call", async (data) => {
        const { callerId, receiverId, roomId, callerName, receiverName } = data;
        const user = await findUserById(callerId);
        const receiver = await findUserById(receiverId)

        const callerSocketId = onlineUsers.get(callerId);
        const receiverSocketId = onlineUsers.get(receiverId);

        if (callerSocketId && receiverSocketId) {
            try {
                const tokenCaller = await createToken(callerId, roomId, user.fullName);
                const tokenReceiver = await createToken(receiverId, roomId, receiverName);

                io.to(callerSocketId).emit("call_accepted", { roomId, token: tokenCaller });
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