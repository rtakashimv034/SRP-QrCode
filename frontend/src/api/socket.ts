import io from "socket.io-client";
import { domain, PORT } from ".";

export const socket = io(`ws://${domain}:${PORT}`, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

// Adicione logs para depuração
socket.on("connect", () => {
  console.log("Conectado ao servidor WebSocket");
});
