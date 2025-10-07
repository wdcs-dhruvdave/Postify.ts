import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  TOKEN_KEY,
  socketEvents,
  NOTIFICATION_API_BASE_URL,
  MESSAGES,
} from "@/constants/index";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketUrl = NOTIFICATION_API_BASE_URL;
    if (!socketUrl) {
      console.error(MESSAGES.ERROR.SOCKET_URL_NOT_DEFINED);
      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      console.log(MESSAGES.SOCKET_LOGS.NO_TOKEN_WARNING);
      return;
    }

    const newSocket = io(socketUrl, {
      auth: {
        token: token,
      },
    });

    setSocket(newSocket);

    newSocket.on(socketEvents.CONNECT, () => {
      console.log(MESSAGES.SOCKET_LOGS.CONNECTED_SUCCESSFULLY, newSocket.id);
    });

    newSocket.on(socketEvents.CONNECT_ERROR, (err) => {
      console.error(MESSAGES.SOCKET_LOGS.CONNECTION_ERROR, err.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
