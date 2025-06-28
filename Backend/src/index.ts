import dotenv from "dotenv";
import connectDB from "./Database/data.ts";
import app from "./app/app.ts";
import SocketService from "./services/socket.ts";
import http from "http";

dotenv.config({
  path: "./.env",
});

// Create a single HTTP server for both Express and WebSocket
const httpServer = http.createServer(app);

connectDB()
  .then(() => {
  const PORT = process.env.PORT || 4001;
    
    // Attach Socket.IO to the existing HTTP server
    const socket = new SocketService();
    socket.io.attach(httpServer);
    socket.initListeners();

    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error, please check:", err);
  });
