"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { MessageCircle, X, Send, Clock } from "lucide-react";
import { useAuth } from "@/context/authContext";

// Hàm để lấy socket URL
const getSocketUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
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
const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default function UserChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string; time?: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newMessageAlert, setNewMessageAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Xác định danh tính khi kết nối
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      
      // Lấy thông tin người dùng từ context hoặc localStorage
      const userId = user?.id || localStorage.getItem("userId") || "user_" + Math.random().toString(36).substring(2, 9);
      const userName = user?.fullname || localStorage.getItem("userName") || "User";
      
      // Xác định danh tính với server
      socket.emit("identifyUser", { userId, userName, isAdmin: false });
      console.log("Sent identifyUser event for user:", { userId, userName });
    });

    socket.on("identified", (data) => {
      console.log("Identification response:", data);
      if (data.status === 'success' && data.role === 'user') {
        console.log("User successfully identified with socket ID:", data.socketId);
        // Lưu thông tin user vào localStorage nếu chưa có
        if (!localStorage.getItem("userId") && data.userId) {
          localStorage.setItem("userId", data.userId);
        }
        if (!localStorage.getItem("userName") && data.userInfo?.name) {
          localStorage.setItem("userName", data.userInfo.name);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      socket.off("connect");
      socket.off("identified");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, [user]);

  // Nhận tin nhắn từ admin
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      // Kiểm tra xem tin nhắn đã tồn tại chưa để tránh hiển thị trùng lặp
      const messageExists = messages.some(
        (m) => m.text === msg.text && m.sender === msg.senderName
      );
      
      if (!messageExists) {
        // Format timestamp
        const messageTime = msg.timestamp 
          ? new Date(msg.timestamp).toLocaleTimeString('vi-VN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          : new Date().toLocaleTimeString('vi-VN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
        
        setMessages((prev) => [...prev, {
          sender: msg.senderName,
          text: msg.text,
          time: messageTime
        }]);
        
        // Show new message alert if chat is closed
        if (!isOpen) {
          setNewMessageAlert(true);
        }
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [isOpen, messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    
    // Format timestamp
    const now = new Date();
    const time = now.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Get user info from context or localStorage
    const userId = user?.id || localStorage.getItem("userId");
    const userName = user?.fullname || localStorage.getItem("userName") || "User";
    
    socket.emit("sendMessage", { 
      text: message,
      userId,
      userName
    });
    
    setMessages((prev) => [...prev, { 
      sender: "User", 
      text: message, 
      time 
    }]);
    setMessage("");
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setNewMessageAlert(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div>
      {/* Chat bubble button */}
      <button
        className={`fixed bottom-4 right-4 p-4 rounded-full shadow-lg transition-all duration-300 z-40 flex items-center justify-center ${
          newMessageAlert
            ? "bg-red-500 animate-pulse hover:bg-red-600"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={toggleChat}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
        {newMessageAlert && !isOpen && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-30 transition-all duration-300 border border-gray-200">
          {/* Chat header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <div>
                <h3 className="font-medium">Chat với Admin</h3>
                <p className="text-xs text-blue-100">
                  {user?.fullname || localStorage.getItem("userName") || "User"}
                </p>
              </div>
            </div>
            <button onClick={toggleChat} className="text-blue-100 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Chat messages */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageCircle size={40} className="mb-2" />
                <p>Chưa có tin nhắn nào</p>
                <p className="text-sm">Hãy bắt đầu cuộc trò chuyện!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex mb-3 ${msg.sender === "User" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] ${msg.sender === "User" ? "order-1" : "order-2"}`}>
                    <div
                      className={`p-2.5 rounded-lg ${
                        msg.sender === "User"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-white text-gray-800 rounded-tl-none border border-gray-200"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className={`text-xs text-gray-500 mt-0.5 flex items-center ${msg.sender === "User" ? "justify-end" : "justify-start"}`}>
                      <Clock size={12} className="mr-1" />
                      {msg.time || ""}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-2 py-1.5 bg-transparent focus:outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className={`p-1.5 rounded-full ${
                  message.trim() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300"
                } transition ml-2`}
              >
                <Send size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}