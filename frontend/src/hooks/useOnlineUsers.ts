import { socket } from "@/api/socket";
import { useEffect, useState } from "react";

export function useOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    // Escuta o evento "online-users" para obter a lista inicial de usuários online
    socket.on("online-users", (users: string[]) => {
      setOnlineUsers(users);
    });

    // Escuta o evento "user-status" para atualizar a lista de usuários online
    socket.on(
      "user-status",
      ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
        setOnlineUsers((prev) => {
          if (isOnline) {
            return [...prev, userId];
          } else {
            return prev.filter((id) => id !== userId);
          }
        });
      }
    );

    // Limpa os listeners ao desmontar o componente
    return () => {
      socket.off("online-users");
      socket.off("user-status");
    };
  }, []);

  return onlineUsers;
}
