import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import multer from "multer";
import path from "path";
import { Server } from "socket.io";
import { routes } from "./routes";

dotenv.config();

const PORT = 3333;
const domain = process.env.EST;
const app = express();

const corsSettings = {
  origin: "*",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  methods: "*",
};

app.use(cors(corsSettings));

app.use(express.json());

// handle multipart upload
app.use("/api/v1/uploads", express.static(path.join(__dirname, "uploads")));
app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    // Erro do multer (ex: arquivo muito grande)
    res.status(400).json({ error: err.message });
    console.log("erro com multer");
  } else if (err) {
    // Outros erros
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});
app.use("/api/v1", routes);

// Cria um servidor HTTP a partir do Express
const server = createServer(app);
// Configura o Socket.IO para usar o mesmo servidor HTTP
export const io = new Server(server, { cors: corsSettings });

// Manipula status dos usuários online (Socket.IO)
export const onlineUsers = new Map<string, string>();
io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  socket.emit("online-users", Array.from(onlineUsers.keys()));

  socket.on("user-online", (userId: string) => {
    onlineUsers.set(userId, socket.id);
    io.emit("user-status", { userId, isOnline: true });
  });
  socket.on("user-offline", (userId: string) => {
    onlineUsers.delete(userId);
    io.emit("user-status", { userId, isOnline: false });
  });
  // Limpa o usuario da lista quando ele faz logout
  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit("user-status", { userId, isOnline: false });
        break;
      }
    }
  });
});

import { z } from "zod";

const dateSchema = z.string().transform((val) => new Date(val).toISOString());

// Testando a conversão
const input = "2025-03-24T11:05:46.890Z";
const result = dateSchema.parse(input);

console.log(result); // Saída: Date object correspondente

server.listen(PORT, "0.0.0.0", () =>
  console.log(`[+] Server is running at http://${domain}:${PORT}/api/v1`)
);
