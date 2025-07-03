import { io } from "socket.io-client";

// Định nghĩa kiểu cho message
interface Message {
  id?: string;
  text: string;
  senderId?: string;
  receiverId?: string;
  timestamp?: Date;
  [key: string]: unknown;
}

// Tạo URL WebSocket dựa trên môi trường
const getSocketUrl = () => {
  const apiUrl = String(process.env.NEXT_PUBLIC_API_URL || '');
  
  if (!apiUrl) {
    return "http://localhost:4000";
  }
  
  // Loại bỏ /api và chuyển đổi protocol
  const baseUrl = apiUrl.replace(/\/api$/, '');
  
  // Chuyển đổi http/https thành ws/wss
  if (baseUrl.startsWith('https://')) {
    return baseUrl.replace('https://', 'wss://');
  } else if (baseUrl.startsWith('http://')) {
    return baseUrl.replace('http://', 'ws://');
  }
  
  return baseUrl;
};

const SOCKET_URL = getSocketUrl();
export const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
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