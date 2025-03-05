import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Define allowed origins for CORS
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    }
});

// Map to store user socket connections
const userSocketMap = new Map(); // More efficient than plain objects

/**
 * Get the socket ID of a receiver user.
 * @param {string} receiverId - The user ID of the receiver.
 * @returns {string | undefined} - The socket ID or undefined if not found.
 */
export const getReceiverSocketId = (receiverId) => userSocketMap.get(receiverId);

io.on("connection", (socket) => {
    console.log(`🔵 User connected: ${socket.id}`);

    try {
        const userId = socket.handshake.query.userId;
        
        if (userId && userId !== "undefined") {
            userSocketMap.set(userId, socket.id);
            console.log(`✅ User ${userId} mapped to socket ${socket.id}`);
        }

        // Emit updated list of online users
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

        socket.on("disconnect", () => handleDisconnection(socket));
    } catch (error) {
        console.error("❌ Error in connection:", error);
    }
});

/**
 * Handle user disconnection.
 * @param {object} socket - The disconnected user's socket.
 */
const handleDisconnection = (socket) => {
    console.log(`🔴 User disconnected: ${socket.id}`);

    try {
        const userId = [...userSocketMap.entries()].find(([_, id]) => id === socket.id)?.[0];

        if (userId) {
            userSocketMap.delete(userId);
            console.log(`❌ User ${userId} removed from userSocketMap`);
        }

        // Emit updated list of online users
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    } catch (error) {
        console.error("❌ Error handling disconnection:", error);
    }
};

export { app, io, server };
