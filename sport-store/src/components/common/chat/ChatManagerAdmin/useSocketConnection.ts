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
  const isConnectingRef = useRef(false);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Tránh khởi tạo nhiều lần trong development mode
    if (isInitializedRef.current) {
      return;
    }

    const connectSocket = () => {
      // Tránh tạo nhiều connection cùng lúc
      if (socketRef.current?.connected || isConnectingRef.current) {
        return;
      }

      isConnectingRef.current = true;
      console.log('🔌 ChatManagerAdmin - Connecting to socket:', SOCKET_URL);

      try {
        const socket = io(SOCKET_URL, {
          reconnection: true,
          reconnectionAttempts: maxReconnectAttempts,
          reconnectionDelay: reconnectInterval,
          timeout: 10000,
          transports: ['websocket', 'polling'],
          forceNew: false, // Thay đổi từ true thành false để tránh tạo connection mới
          autoConnect: true
        });

        socket.on("connect", () => {
          console.log('🔌 ChatManagerAdmin - Socket connected:', socket.id);
          setIsConnected(true);
          reconnectAttempts.current = 0;
          isConnectingRef.current = false;
          
          // Xác định danh tính admin
          socket.emit("identifyUser", { isAdmin: true, userName: "Admin" });
          console.log('🔌 ChatManagerAdmin - Sent identifyUser event for admin');
        });

        socket.on("identified", (data) => {
          console.log('🔌 ChatManagerAdmin - Identification response:', data);
          if (data.status !== 'success' || data.role !== 'admin') {
            console.error("❌ ChatManagerAdmin identification failed:", data);
          } else {
            console.log('✅ ChatManagerAdmin - Admin successfully identified');
          }
        });

        // Thêm listener cho tin nhắn real-time - chỉ khi có callback
        if (onMessageReceived) {
          socket.on("receiveMessage", (message) => {
            console.log('🔌 ChatManagerAdmin - Received message:', message);
            onMessageReceived(message);
          });
        }

        socket.on("disconnect", (reason) => {
          console.log('🔌 ChatManagerAdmin - Socket disconnected:', reason);
          setIsConnected(false);
          isConnectingRef.current = false;
        });

        socket.on("connect_error", (error) => {
          console.error("❌ ChatManagerAdmin Socket connection error:", error);
          setIsConnected(false);
          isConnectingRef.current = false;
          
          // Thử kết nối lại nếu chưa vượt quá số lần thử
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            setTimeout(() => {
              if (!socketRef.current?.connected) {
                connectSocket();
              }
            }, reconnectInterval);
          } else {
            console.error("❌ Max reconnection attempts reached");
          }
        });

        socketRef.current = socket;
        isInitializedRef.current = true;
      } catch (error) {
        console.error("❌ Error creating socket connection:", error);
        isConnectingRef.current = false;
      }
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
        // Remove all listeners trước khi disconnect
        socketRef.current.off("connect");
        socketRef.current.off("identified");
        socketRef.current.off("disconnect");
        socketRef.current.off("connect_error");
        socketRef.current.off("receiveMessage");
        
        // Chỉ disconnect nếu socket đang connected
        if (socketRef.current.connected) {
          socketRef.current.disconnect();
        }
        socketRef.current = null;
        isConnectingRef.current = false;
        isInitializedRef.current = false;
      }
    };
  }, [onMessageReceived]);

  return { socket: socketRef.current, isConnected };
}; 