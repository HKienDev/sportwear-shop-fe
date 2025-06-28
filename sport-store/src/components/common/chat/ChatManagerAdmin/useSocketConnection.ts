import { useState, useEffect, useRef } from 'react';
import { io, Socket } from "socket.io-client";

const SOCKET_URL = (() => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    console.log('🔌 ChatManagerAdmin - No NEXT_PUBLIC_API_URL found, using default localhost');
    return "http://localhost:4000";
  }
  
  console.log('🔌 ChatManagerAdmin - Original API URL:', apiUrl);
  
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
  
  console.log('🔌 ChatManagerAdmin - Converted Socket URL:', socketUrl);
  return socketUrl;
})();

console.log('🔌 ChatManagerAdmin - Final Socket URL:', SOCKET_URL);

// Tạo hook để quản lý kết nối socket
export const useSocketConnection = (onMessageReceived?: (message: any) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 3000; // 3 giây

  useEffect(() => {
    const connectSocket = () => {
      if (socketRef.current?.connected) return;

      console.log('🔌 ChatManagerAdmin - Attempting to connect to:', SOCKET_URL);
      
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
        console.log("✅ ChatManagerAdmin Socket connected:", socket.id);
        setIsConnected(true);
        reconnectAttempts.current = 0;
        
        // Xác định danh tính admin
        socket.emit("identifyUser", { isAdmin: true, userName: "Admin" });
        console.log("📤 Sent identifyUser event for admin");
      });

      socket.on("identified", (data) => {
        console.log("✅ ChatManagerAdmin identification response:", data);
        if (data.status === 'success' && data.role === 'admin') {
          console.log("✅ ChatManagerAdmin successfully identified with socket ID:", data.socketId);
        } else {
          console.error("❌ ChatManagerAdmin identification failed:", data);
        }
      });

      // Thêm listener cho tin nhắn real-time
      socket.on("receiveMessage", (message) => {
        console.log("📨 ChatManagerAdmin received real-time message:", message);
        if (onMessageReceived) {
          onMessageReceived(message);
        }
      });

      socket.on("disconnect", (reason) => {
        console.log("❌ ChatManagerAdmin Socket disconnected:", reason);
        setIsConnected(false);
      });

      socket.on("connect_error", (error) => {
        console.error("❌ ChatManagerAdmin Socket connection error:", error);
        setIsConnected(false);
        
        // Thử kết nối lại nếu chưa vượt quá số lần thử
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`🔄 Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`);
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