// src/sockets/socketManager.js
import { createToken } from "../config/livekit.js";
import { findUserById } from "../dao/auth.dao.js";

// Store online users
const onlineUsers = new Map();

export const setupSocketIO = (io) => {
    io.on("connection", (socket) => {
        // 1. Register User
        socket.on("register", (userId) => {
            if (userId) {
                onlineUsers.set(userId, socket.id);
                // console.log(`User registered: ${userId}`);
            }
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
        socket.on("accept_call", async (data) => {
            const { callerId, receiverId, roomId, callerName, receiverName } = data;
            
            // Parallel data fetching for speed
            const [user, receiver] = await Promise.all([
                findUserById(callerId),
                findUserById(receiverId) // Ensure this DAO method exists or use generic findById
            ]);

            const callerSocketId = onlineUsers.get(callerId);
            const receiverSocketId = onlineUsers.get(receiverId);

            if (callerSocketId && receiverSocketId) {
                try {
                    // Generate LiveKit tokens
                    const tokenCaller = await createToken(callerId, roomId, user?.fullName || callerName);
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

        // 5. Disconnect
        socket.on("disconnect", () => {
            for (const [key, value] of onlineUsers.entries()) {
                if (value === socket.id) {
                    onlineUsers.delete(key);
                    break;
                }
            }
        });
    });
};