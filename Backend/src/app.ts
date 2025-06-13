import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

const app = express();
const PORT = 3000;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// In-memory storage for messages
interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}
const messages: ChatMessage[] = [];

// Setup cors and express.json()
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Errgo Backend Interview Module Loaded Successfully!");
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send existing messages to the new user
  socket.emit("initial messages", messages);

  socket.on("chat message", (msg: { user: string; text: string }) => {
    const newMessage: ChatMessage = {
      id: socket.id + "-" + Date.now(), // Simple unique ID
      user: msg.user || "Anonymous",
      text: msg.text,
      timestamp: new Date().toISOString(),
    };
    messages.push(newMessage);
    io.emit("chat message", newMessage); // Broadcast to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
