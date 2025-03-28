import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketInst = (roomId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return; // Prevent starting socket without userId

    const socket = io( "http://172.26.144.1:3008", {
        transports: ["websocket"],
    });

    setSocket(socket);

    return () => socket.disconnect(); // Cleanup on unmount
  }, [roomId]);

  return socket;
};

export default SocketInst;