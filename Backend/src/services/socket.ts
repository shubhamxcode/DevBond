import { Server } from "socket.io";
import Redis from 'ioredis';


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

    constructor() {
        console.log("Initializing socket server...");
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            }
        });
        // Subscribe to Valkey (Redis) channel
        sub.subscribe("MESSAGES");

        // Listen for messages from Valkey
        sub.on("message", (channel: string, message: string) => {
            console.log(`Received message from Valkey channel ${channel}: ${message}`);

            if (channel === "MESSAGES") {
                this._io.emit("message", JSON.parse(message)); // Broadcast to clients
            }
        });
    }

    public initListeners() {
        console.log("Initializing socket listeners...");

        this._io.on("connection", (socket) => {
            console.log(`New socket connected: ${socket.id}`);

            // Listen for messages and publish to Valkey
            socket.on("event:message", async ({ message }: { message: string }) => {
                console.log("New message received:", message);
                await pub.publish("MESSAGES", JSON.stringify({ message }));
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