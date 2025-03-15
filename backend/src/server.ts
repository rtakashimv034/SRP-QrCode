import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import path from "path";
import { routes } from "./routes";
dotenv.config();

const PORT = 3333;
const domain = process.env.LOCAL;
const app = express();

app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    methods: "*",
  })
);

app.use(express.json());

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
app.use((req, res, next) => {
  console.log(`[+] Request received from: ${req.ip}`);
  next();
});
app.listen(PORT, "0.0.0.0", () =>
  console.log(`[+] Server is running at http://${domain}:${PORT}/api/v1`)
);
