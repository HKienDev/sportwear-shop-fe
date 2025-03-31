import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000", {
  withCredentials: true,
});

export const initializeSocket = (userId?: string) => {
  if (userId) {
    socket.emit("identifyUser", { userId });
  }
};

export const sendMessage = (text: string) => {
  socket.emit("sendMessage", { text });
};

export const onReceiveMessage = (callback: (message: any) => void) => {
  socket.on("receiveMessage", callback);
};

export default socket; 