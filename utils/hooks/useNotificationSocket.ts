import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { TOKEN_KEY } from "@/constants/auth";
import { socketEvents } from "@/constants/chat";
import { NOTIFICATION_API_BASE_URL } from "@/constants/api";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketUrl = NOTIFICATION_API_BASE_URL;
    if (!socketUrl) {
      console.error("NEXT_PUBLIC_CHAT_SOCKET_URL is not defined in .env.local");
      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      console.log("No auth token found, socket connection not initiated.");
      return;
    }

    const newSocket = io(socketUrl, {
      auth: {
        token: token,
      },
    });

    setSocket(newSocket);

    newSocket.on(socketEvents.CONNECT, () => {
      console.log("Socket connected successfully:", newSocket.id);
    });

    newSocket.on(socketEvents.CONNECT_ERROR, (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
