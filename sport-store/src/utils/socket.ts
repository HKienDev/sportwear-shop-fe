import { io } from "socket.io-client";
import { API_URL } from "@/utils/api";

// Định nghĩa kiểu cho message
interface Message {
  id?: string;
  text: string;
  senderId?: string;
  receiverId?: string;
  timestamp?: Date;
  [key: string]: unknown;
}

const socket = io(API_URL, {
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

export const onReceiveMessage = (callback: (message: Message) => void) => {
  socket.on("receiveMessage", callback);
};

export default socket; 