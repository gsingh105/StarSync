import { createToken } from "../config/livekit.js";
import authModel from "../models/auth.model.js";
import Astrologer from "../models/astrologer.model.js";
import CallTransaction from "../models/callTransaction.model.js";

const onlineUsers = new Map();
const callTimers = new Map();

export const setupSocketIO = (io) => {
    io.on("connection", (socket) => {
        socket.on("register", (userId) => {
            if (userId) {
                onlineUsers.set(userId, socket.id);
                console.log(`User ${userId} registered.`);
            }
        });

        socket.on("call_request", (data) => {
            const { callerId, callerName, receiverId, durationSeconds } = data;
            const receiverSocketId = onlineUsers.get(receiverId);

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("incoming_call", {
                    callerId, callerName, durationSeconds,
                    roomId: `room-${callerId}-${receiverId}`
                });
            } else {
                socket.emit("call_failed", { message: "Astrologer is offline." });
            }
        });

        socket.on("accept_call", async (data) => {
            const { callerId, receiverId, roomId, durationSeconds } = data;
            
            try {
                const [user, astro] = await Promise.all([
                    authModel.findById(callerId),
                    Astrologer.findById(receiverId)
                ]);

                const minutes = durationSeconds / 60;
                const totalCost = astro.price * minutes;

                if (user.walletBalance < totalCost) {
                    socket.emit("call_failed", { message: "User balance low." });
                    io.to(onlineUsers.get(callerId)).emit("call_failed", { message: "Insufficient balance." });
                    return;
                }

                // PAY-ON-CONNECT: Deduct only now
                user.walletBalance -= totalCost;
                await user.save();

                await CallTransaction.create({
                    userId: user._id,
                    astrologerId: astro._id,
                    amount: totalCost,
                    durationMinutes: minutes
                });

                const tokenCaller = await createToken(callerId, roomId, user.fullName);
                const tokenReceiver = await createToken(receiverId, roomId, astro.name);

                io.to(onlineUsers.get(callerId)).emit("call_accepted", { roomId, token: tokenCaller });
                socket.emit("call_accepted", { roomId, token: tokenReceiver });

                const timer = setTimeout(() => {
                    io.to(onlineUsers.get(callerId)).emit("force_disconnect");
                    socket.emit("force_disconnect");
                }, durationSeconds * 1000);

                callTimers.set(roomId, timer);
            } catch (err) {
                console.error("Accept Error:", err);
            }
        });

        socket.on("disconnect", () => {
            for (const [uid, sid] of onlineUsers.entries()) {
                if (sid === socket.id) onlineUsers.delete(uid);
            }
        });
    });
};