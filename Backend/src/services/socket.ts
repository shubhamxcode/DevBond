import { Server } from "socket.io";
import Redis from 'ioredis';

interface PrivateMessageData {
    senderId: string;
    senderName: string;
    recipientId: string;
    message: string;
}


const pub = new Redis({
    host: process.env.AIVEN_HOST,
    port: Number(process.env.AIVEN_PORT),
    username: process.env.AIVEN_USERNAME,
    password: process.env.AIVEN_PASSWORD,
    tls: {},
});

const sub = new Redis({
    host: process.env.AIVEN_HOST,
    port: Number(process.env.AIVEN_PORT),
    username: process.env.AIVEN_USERNAME,
    password: process.env.AIVEN_PASSWORD,
    tls: {},
   
});

class SocketService {
    private _io: Server;
    private userSocketMap: Map<string, string> = new Map(); // userId -> socketId mapping

    constructor() {
        console.log("Initializing socket server...");
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            }
        });
        // Subscribe to Valkey (Redis) channel for private messages
        sub.subscribe("PRIVATE_MESSAGES");

        // Listen for messages from Valkey
        sub.on("message", (channel: string, message: string) => {
            console.log(`Received message from Valkey channel ${channel}: ${message}`);

            if (channel === "PRIVATE_MESSAGES") {
                const parsedMessage = JSON.parse(message);
                this.handlePrivateMessage(parsedMessage);
            }
        });
    }

    private handlePrivateMessage(messageData: PrivateMessageData) {
        const { recipientId, senderId, message, senderName } = messageData;
        
        // Get recipient's socket ID
        const recipientSocketId = this.userSocketMap.get(recipientId);
        const senderSocketId = this.userSocketMap.get(senderId);
        
        if (recipientSocketId) {
            // Send message to recipient
            this._io.to(recipientSocketId).emit("private-message", {
                senderId,
                senderName,
                message,
                timestamp: new Date()
            });
        }
        
        if (senderSocketId) {
            // Send confirmation back to sender
            this._io.to(senderSocketId).emit("message-sent", {
                recipientId,
                message,
                timestamp: new Date()
            });
        }
    }

    public initListeners() {
        console.log("Initializing socket listeners...");

        this._io.on("connection", (socket) => {
            console.log(`New socket connected: ${socket.id}`);

            // Handle user joining (authentication)
            socket.on("join-user", ({ userId, username }: { userId: string, username: string }) => {
                console.log(`User ${username} (${userId}) joined with socket ${socket.id}`);
                this.userSocketMap.set(userId, socket.id);
                socket.data.userId = userId;
                socket.data.username = username;
            });

            // Handle private messages
            socket.on("private-message", async ({ recipientId, message }: { recipientId: string, message: string }) => {
                const senderId = socket.data.userId;
                const senderName = socket.data.username;
                
                if (!senderId || !senderName) {
                    socket.emit("error", { message: "User not authenticated" });
                    return;
                }
                
                console.log(`Private message from ${senderName} to ${recipientId}: ${message}`);
                
                // Publish to Redis for scaling across multiple servers
                await pub.publish("PRIVATE_MESSAGES", JSON.stringify({
                    senderId,
                    senderName,
                    recipientId,
                    message
                }));
            });

            // Handle disconnect
            socket.on("disconnect", () => {
                console.log(`Socket ${socket.id} disconnected`);
                if (socket.data.userId) {
                    this.userSocketMap.delete(socket.data.userId);
                }
            });
        });
    }

    get io() {
        return this._io;
    }

    public attachServer(server: any) {
        this._io.attach(server);
    }
}

export default SocketService;
