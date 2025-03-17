import io from "socket.io-client";
import { domain, PORT } from ".";

const wsURL = `ws://${domain}:${PORT}`;

export const socket = io(wsURL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

// Adicione logs para depuração
socket.on("connect", () => {
  console.log(`Conectado ao servidor WebSocket em ${wsURL}`);
});

// Novo usuário foi criado
