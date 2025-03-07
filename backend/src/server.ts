import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { routes } from "./routes";
dotenv.config();

const PORT = 3333;
const domain = process.env.CALLIDUS;
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
app.use("/api/v1", routes);
app.listen(PORT, "0.0.0.0", () =>
  console.log(`[+] Server is running at http://${domain}:${PORT}/api/v1`)
);
