import { useState, useEffect, useRef } from 'react';
import { io, Socket } from "socket.io-client";
import { ServerMessage } from './types';

const SOCKET_URL = (() => {
  const apiUrl: string = process.env.NEXT_PUBLIC_API_URL || '';
  
  if (!apiUrl) {
    return "http://localhost:4000";
  }
  
  // Loại bỏ /api và chuyển đổi protocol
  const baseUrl = apiUrl.replace(/\/api$/, '');
  
  // Chuyển đổi http/https thành ws/wss
  let socketUrl;
  if (baseUrl.startsWith('https://')) {
    socketUrl = baseUrl.replace('https://', 'wss://');
  } else if (baseUrl.startsWith('http://')) {
    socketUrl = baseUrl.replace('http://', 'ws://');
  } else {
    socketUrl = baseUrl;
  }
  
  return socketUrl;
})();

// Tạo hook để quản lý kết nối socket
export const useSocketConnection = (onMessageReceived?: (message: ServerMessage) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 3000; // 3 giây

  useEffect(() => {
    const connectSocket = () => {
      if (socketRef.current?.connected) return;

      const socket = io(SOCKET_URL, {
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: reconnectInterval,
        timeout: 10000,
        transports: ['websocket', 'polling'],
        forceNew: true,
        autoConnect: true
      });

      socket.on("connect", () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
        
        // Xác định danh tính admin
        socket.emit("identifyUser", { isAdmin: true, userName: "Admin" });
      });

      socket.on("identified", (data) => {
        if (data.status !== 'success' || data.role !== 'admin') {
          console.error("❌ ChatManagerAdmin identification failed:", data);
        }
      });

      // Thêm listener cho tin nhắn real-time
      socket.on("receiveMessage", (message) => {
        if (onMessageReceived) {
          onMessageReceived(message);
        }
      });

      socket.on("disconnect", (reason) => {
        setIsConnected(false);
      });

      socket.on("connect_error", (error) => {
        console.error("❌ ChatManagerAdmin Socket connection error:", error);
        setIsConnected(false);
        
        // Thử kết nối lại nếu chưa vượt quá số lần thử
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          setTimeout(connectSocket, reconnectInterval);
        } else {
          console.error("❌ Max reconnection attempts reached");
        }
      });

      socketRef.current = socket;
    };

    // Kiểm tra xem đã đăng nhập chưa
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    console.log('🔌 ChatManagerAdmin - Admin logged in status:', isLoggedIn);
    
    if (isLoggedIn) {
      connectSocket();
    } else {
      console.log('🔌 ChatManagerAdmin - Admin not logged in, setting adminLoggedIn to true');
      localStorage.setItem("adminLoggedIn", "true");
      connectSocket();
    }

    return () => {
      if (socketRef.current) {
        console.log("🧹 Cleaning up ChatManagerAdmin socket connection");
        socketRef.current.disconnect();
      }
    };
  }, [onMessageReceived]);

  return { socket: socketRef.current, isConnected };
}; 