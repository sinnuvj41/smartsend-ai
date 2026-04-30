import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import fs from "fs";

dotenv.config();
connectDB();

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
  }
});

app.set("io", io);

let onlineUsers = 0;

io.on("connection", (socket) => {
  onlineUsers++;

  console.log("Socket connected:", socket.id);

  // send count to all clients
  io.emit("online-users", onlineUsers);

  socket.on("disconnect", () => {
    onlineUsers--;

    console.log("Socket disconnected:", socket.id);

    io.emit("online-users", onlineUsers);
  });
});

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

app.use("/api", apiLimiter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SmartSend AI API is running"
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    app: "SmartSend AI",
    status: "OK",
    environment: process.env.NODE_ENV || "development"
  });
});

app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

server.listen(PORT, () => {
  console.log(`SmartSend AI server running on port ${PORT}`);
});