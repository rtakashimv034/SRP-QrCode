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
const domain = process.env.LOCAL;
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

io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

server.listen(PORT, "0.0.0.0", () =>
  console.log(`[+] Server is running at http://${domain}:${PORT}/api/v1`)
);
