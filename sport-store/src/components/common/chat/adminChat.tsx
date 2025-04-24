"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { 
  Send, Trash2, Search, User, Users, MessageSquare, Bell, MoreHorizontal, Smile, Paperclip, Palette
} from "lucide-react";

// Khai báo kiểu dữ liệu cho Conversation
interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  online: boolean;
  unread: number;
}

// Khai báo kiểu dữ liệu cho Message
interface Message {
  sender: string;
  text: string;
  time?: string;
  senderId?: string;
  senderName?: string;
  timestamp?: string;
  messageId?: string;
}

interface ServerMessage {
  senderId: string;
  senderName?: string;
  text: string;
  timestamp?: string;
  messageId?: string;
}

// Định nghĩa interface cho thông tin người dùng
interface UserInfo {
  _id: string;
  id: string;
  name: string;
  email: string;
  fullName?: string;
  tempId?: string;
}

// Tạo hook để quản lý kết nối socket
const useSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 3000; // 3 giây

  useEffect(() => {
    const connectSocket = () => {
      if (socketRef.current?.connected) return;

      const socket = io("http://localhost:4000", {
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: reconnectInterval,
        timeout: 10000,
      });

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
        setIsConnected(true);
        reconnectAttempts.current = 0;
        
        // Xác định danh tính admin
        socket.emit("identifyUser", { isAdmin: true, userName: "Admin" });
        console.log("Sent identifyUser event for admin");
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
        
        // Thử kết nối lại nếu chưa vượt quá số lần thử
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          setTimeout(connectSocket, reconnectInterval);
        }
      });

      socketRef.current = socket;
    };

    // Kiểm tra xem đã đăng nhập chưa
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (isLoggedIn) {
      connectSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return { socket: socketRef.current, isConnected };
};

export default function AdminChat() {
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("all"); // 'all', 'online', 'unread'
  const [theme, setTheme] = useState("blue"); // 'blue', 'purple', 'green'
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [users, setUsers] = useState<UserInfo[]>([]);
  
  // Sử dụng hook useSocketConnection
  const { socket, isConnected } = useSocketConnection();

  // Lưu trạng thái đăng nhập khi component mount
  useEffect(() => {
    localStorage.setItem("adminLoggedIn", "true");
  }, []);

  // Lấy danh sách người dùng từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/users');
        if (response.ok) {
          const data = await response.json();
          console.log("Raw API response:", data);
          
          // Kiểm tra cấu trúc dữ liệu và chuyển đổi thành mảng nếu cần
          let usersArray = [];
          
          if (Array.isArray(data)) {
            usersArray = data;
          } else if (data && typeof data === 'object') {
            // Nếu data là một object, kiểm tra xem có thuộc tính nào chứa mảng không
            for (const key in data) {
              if (Array.isArray(data[key])) {
                usersArray = data[key];
                break;
              }
            }
          }
          
          console.log("Processed users array:", usersArray);
          setUsers(usersArray);
        } else {
          console.error("Failed to fetch users:", response.statusText);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  // Hàm để lấy thông tin người dùng từ danh sách users
  const getUserInfo = useCallback((userId: string) => {
    // Kiểm tra xem users có phải là mảng không
    if (!Array.isArray(users)) {
      console.error("Users is not an array:", users);
      return null;
    }
    
    console.log("Looking for user with ID:", userId);
    console.log("Available users:", users);
    
    // Tìm người dùng trong danh sách users
    const user = users.find(u => {
      const matchById = u.id === userId || u._id === userId;
      const matchByTempId = userId.startsWith('temp_') && u.tempId === userId;
      return matchById || matchByTempId;
    });
    
    console.log("Found user:", user);
    return user;
  }, [users]);

  // Load dữ liệu từ localStorage khi component được mount
  useEffect(() => {
    const savedConversations = localStorage.getItem("adminConversations");
    const savedMessages = localStorage.getItem("adminMessages");
    const savedTheme = localStorage.getItem("adminTheme");

    if (savedConversations) {
      try {
        setConversations(JSON.parse(savedConversations));
      } catch (error) {
        console.error("Error parsing conversations:", error);
      }
    }

    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error("Error parsing messages:", error);
      }
    }

    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Lưu dữ liệu vào localStorage khi conversations, messages hoặc theme thay đổi
  useEffect(() => {
    localStorage.setItem("adminConversations", JSON.stringify(conversations));
    localStorage.setItem("adminMessages", JSON.stringify(messages));
    localStorage.setItem("adminTheme", theme);
  }, [conversations, messages, theme]);

  // Yêu cầu lịch sử tin nhắn khi chọn user và socket đã kết nối
  useEffect(() => {
    if (selectedUser && socket && isConnected) {
      socket.emit("requestMessageHistory", { userId: selectedUser.id });
      console.log(`Requested message history for user ${selectedUser.id}`);
    }
  }, [selectedUser, socket, isConnected]);

  // Nhận lịch sử tin nhắn từ BE
  useEffect(() => {
    if (!socket) return;

    socket.on("messageHistory", (history: ServerMessage[]) => {
      console.log("Received message history:", history);
      
      if (selectedUser?.id) {
        // Chuyển đổi định dạng tin nhắn từ BE sang định dạng FE
        const formattedHistory = history.map((msg: ServerMessage) => {
          // Lấy thông tin người dùng từ danh sách users
          let senderName = msg.senderName;
          let senderId = msg.senderId;
          
          if (msg.senderId !== 'admin') {
            const userInfo = getUserInfo(msg.senderId);
            if (userInfo) {
              senderName = userInfo.fullName || userInfo.name || "Unknown User";
              senderId = userInfo._id || userInfo.id || msg.senderId;
              console.log("Updated sender info:", { senderName, senderId });
            } else {
              console.log("User not found in users array, using default values");
            }
          }
          
          return {
            sender: senderName || (msg.senderId === 'admin' ? 'Admin' : 'User'),
            text: msg.text,
            time: msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('vi-VN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : undefined,
            senderId: senderId,
            senderName: senderName,
            timestamp: msg.timestamp
          };
        });
        
        setMessages((prev) => ({
          ...prev,
          [selectedUser.id]: formattedHistory,
        }));
      }
    });

    return () => {
      socket.off("messageHistory");
    };
  }, [selectedUser, socket, users, getUserInfo]);

  // Nhận tin nhắn từ user
  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (msg) => {
      console.log("Received message:", msg);
      
      // Kiểm tra xem tin nhắn có phải do admin gửi không
      if (msg.senderId === 'admin') {
        // Nếu là tin nhắn do admin gửi, kiểm tra xem đã tồn tại trong state chưa
        const adminMessageExists = messages[msg.recipientId]?.some(
          (m) => m.messageId === msg.messageId
        );
        
        if (adminMessageExists) {
          console.log("Admin message already exists, skipping");
          return;
        }
      }
      
      // Lấy thông tin người dùng từ danh sách users
      let senderName = msg.senderName;
      let senderId = msg.senderId;
      
      if (msg.senderId !== 'admin') {
        const userInfo = getUserInfo(msg.senderId);
        if (userInfo) {
          senderName = userInfo.fullName || userInfo.name || "Unknown User";
          senderId = userInfo._id || userInfo.id || msg.senderId;
          console.log("Updated sender info:", { senderName, senderId });
        } else {
          console.log("User not found in users array, using default values");
        }
      }
      
      // Kiểm tra xem tin nhắn đã tồn tại chưa để tránh hiển thị trùng lặp
      const messageExists = messages[msg.senderId]?.some(
        (m) => m.text === msg.text && m.sender === senderName && 
        Math.abs(new Date(m.timestamp || '').getTime() - new Date(msg.timestamp || '').getTime()) < 1000
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

        // Kiểm tra xem người dùng đã tồn tại trong danh sách cuộc trò chuyện chưa
        const userExists = conversations.some((conv) => conv.id === msg.senderId);

        if (!userExists) {
          // Thêm người dùng mới vào danh sách cuộc trò chuyện
          const newUser = {
            id: senderId,
            name: senderName || "Unknown",
            lastMessage: msg.text,
            online: true,
            unread: 1,
          };
          
          setConversations((prev) => [...prev, newUser]);
        } else {
          // Cập nhật tin nhắn cuối cùng và số tin nhắn chưa đọc
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === msg.senderId
                ? {
                    ...conv,
                    lastMessage: msg.text,
                    unread: conv.id === selectedUser?.id ? 0 : conv.unread + 1,
                  }
                : conv
            )
          );
        }

        // Lưu tin nhắn vào lịch sử
        setMessages((prev) => {
          const newMessages = { ...prev };
          if (!newMessages[msg.senderId]) {
            newMessages[msg.senderId] = [];
          }
          newMessages[msg.senderId].push({ 
            sender: senderName || "User", 
            text: msg.text, 
            time: messageTime,
            senderId: senderId,
            senderName: senderName,
            timestamp: msg.timestamp,
            messageId: msg.messageId // Thêm messageId để có thể kiểm tra trùng lặp
          });
          return newMessages;
        });
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedUser, conversations, messages, socket, users, getUserInfo]);

  // Lắng nghe sự kiện đăng xuất của user
  useEffect(() => {
    if (!socket) return;

    socket.on("userLogout", (userId: string) => {
      console.log(`User ${userId} logged out`);
      
      // Xóa tin nhắn của user đã đăng xuất
      setMessages((prev) => {
        const newMessages = { ...prev };
        delete newMessages[userId];
        return newMessages;
      });
      
      // Xóa user khỏi danh sách cuộc trò chuyện
      setConversations((prev) => prev.filter((conv) => conv.id !== userId));
      
      // Nếu user đang được chọn, bỏ chọn
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
    });

    return () => {
      socket.off("userLogout");
    };
  }, [socket, selectedUser]);

  const sendMessage = () => {
    if (!message.trim() || !selectedUser || !socket || !isConnected) return;

    // Format timestamp
    const now = new Date();
    const time = now.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Tạo một ID duy nhất cho tin nhắn để tránh trùng lặp
    const messageId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Gửi tin nhắn qua socket
    socket.emit("sendMessage", { 
      text: message, 
      recipientId: selectedUser.id,
      messageId: messageId // Thêm messageId để server có thể kiểm tra trùng lặp
    });

    // Lưu tin nhắn vào lịch sử ngay lập tức
    setMessages((prev) => {
      const newMessages = { ...prev };
      if (!newMessages[selectedUser.id]) {
        newMessages[selectedUser.id] = [];
      }
      
      // Kiểm tra xem tin nhắn đã tồn tại chưa
      const messageExists = newMessages[selectedUser.id].some(
        (m) => m.text === message && m.sender === "Admin" && 
        Math.abs(new Date(m.timestamp || '').getTime() - now.getTime()) < 1000
      );
      
      if (!messageExists) {
        newMessages[selectedUser.id].push({ 
          sender: "Admin", 
          text: message, 
          time,
          senderId: 'admin',
          senderName: 'Admin',
          timestamp: now.toISOString(),
          messageId: messageId // Thêm messageId để có thể kiểm tra trùng lặp
        });
      }
      
      return newMessages;
    });

    // Cập nhật tin nhắn cuối cùng trong danh sách cuộc trò chuyện
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedUser.id ? { ...conv, lastMessage: message, unread: 0 } : conv
      )
    );

    setMessage("");
  };

  // Xóa cuộc trò chuyện
  const deleteConversation = (userId: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== userId));
    setMessages((prev) => {
      const newMessages = { ...prev };
      delete newMessages[userId];
      return newMessages;
    });
    if (selectedUser?.id === userId) {
      setSelectedUser(null);
    }
  };

  // Lọc danh sách cuộc trò chuyện
  const filteredConversations = conversations.filter((conv) => {
    if (!conv || typeof conv.name !== "string") return false;

    // Filter by search
    const matchesSearch =
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by view type
    if (view === "online" && !conv.online) return false;
    if (view === "unread" && conv.unread === 0) return false;

    return matchesSearch;
  });

  // Tính toán số liệu thống kê
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0);
  const onlineUsers = conversations.filter((conv) => conv.online).length;

  // Theme color configuration
  const themeColors = {
    blue: {
      primary: "bg-blue-500",
      primaryHover: "hover:bg-blue-600",
      primaryLight: "bg-blue-50",
      primaryText: "text-blue-500",
      secondary: "bg-sky-500",
      highlight: "from-blue-400 to-sky-500",
      lightHighlight: "from-blue-50 to-sky-50",
      border: "border-blue-200",
    },
    purple: {
      primary: "bg-violet-500",
      primaryHover: "hover:bg-violet-600",
      primaryLight: "bg-violet-50",
      primaryText: "text-violet-500",
      secondary: "bg-fuchsia-500",
      highlight: "from-violet-400 to-fuchsia-500",
      lightHighlight: "from-violet-50 to-fuchsia-50",
      border: "border-violet-200",
    },
    green: {
      primary: "bg-emerald-500",
      primaryHover: "hover:bg-emerald-600",
      primaryLight: "bg-emerald-50",
      primaryText: "text-emerald-500",
      secondary: "bg-teal-500",
      highlight: "from-emerald-400 to-teal-500",
      lightHighlight: "from-emerald-50 to-teal-50",
      border: "border-emerald-200",
    }
  };

  const colors = themeColors[theme as keyof typeof themeColors];

  const getAvatarColor = (index: number) => {
    const avatarColors = [
      "from-blue-400 to-sky-400",
      "from-purple-400 to-fuchsia-400",
      "from-emerald-400 to-teal-400",
      "from-amber-400 to-orange-400",
      "from-rose-400 to-pink-400"
    ];
    return avatarColors[index % avatarColors.length];
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top header */}
        <header className="bg-white shadow-sm py-3 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${colors.highlight} flex items-center justify-center`}>
              <MessageSquare size={16} className="text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">ChatAdmin</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Connection status */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            
            {/* Theme selector dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                className={`p-2 rounded-full ${colors.primaryLight} ${colors.primaryText}`}
              >
                <Palette size={18} />
              </button>
              
              {showThemeSelector && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg p-3 z-10 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Choose Theme</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setTheme("blue");
                        setShowThemeSelector(false);
                      }}
                      className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-sky-400 ${theme === "blue" ? "ring-2 ring-blue-500" : ""}`}
                    ></button>
                    <button 
                      onClick={() => {
                        setTheme("purple");
                        setShowThemeSelector(false);
                      }}
                      className={`w-8 h-8 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 ${theme === "purple" ? "ring-2 ring-violet-500" : ""}`}
                    ></button>
                    <button 
                      onClick={() => {
                        setTheme("green");
                        setShowThemeSelector(false);
                      }}
                      className={`w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 ${theme === "green" ? "ring-2 ring-emerald-500" : ""}`}
                    ></button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Stats badges */}
            <div className="hidden md:flex items-center gap-3 mx-2">
              <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-xs font-medium">{onlineUsers} online</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <span className="text-xs font-medium">{totalUnread} unread</span>
              </div>
            </div>
            
            {/* Notification button */}
            <button className={`p-2 rounded-full relative ${colors.primaryLight} ${colors.primaryText}`}>
              <Bell size={18} />
              {totalUnread > 0 && (
                <span className={`absolute -top-1 -right-1 w-5 h-5 ${colors.primary} rounded-full text-white text-xs flex items-center justify-center shadow-md`}>
                  {totalUnread > 9 ? '9+' : totalUnread}
                </span>
              )}
            </button>
            
            {/* Admin avatar */}
            <div className="flex items-center gap-2 ml-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-300 to-orange-400 flex items-center justify-center shadow-sm">
                <User size={14} className="text-white" />
              </div>
              <span className="text-sm font-medium hidden md:inline">Admin</span>
            </div>
          </div>
        </header>
        
        {/* Content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversation list */}
          <div className="w-80 border-r border-gray-100 flex flex-col bg-white">
            <div className="p-3">
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              </div>
              
              <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                <button 
                  onClick={() => setView("all")}
                  className={`flex-1 text-xs py-2 rounded-md transition font-medium ${view === "all" ? `${colors.primary} text-white shadow-md` : "hover:bg-gray-200 text-gray-600"}`}
                >
                  All Chats
                </button>
                <button 
                  onClick={() => setView("online")}
                  className={`flex-1 text-xs py-2 rounded-md transition font-medium ${view === "online" ? `${colors.primary} text-white shadow-md` : "hover:bg-gray-200 text-gray-600"}`}
                >
                  Online
                </button>
                <button 
                  onClick={() => setView("unread")}
                  className={`flex-1 text-xs py-2 rounded-md transition font-medium ${view === "unread" ? `${colors.primary} text-white shadow-md` : "hover:bg-gray-200 text-gray-600"}`}
                >
                  Unread
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv, index) => (
                  <div
                    key={conv.id || index} 
                    onClick={() => {
                      setSelectedUser(conv);
                      setConversations((prev) =>
                        prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c))
                      );
                    }}
                    className={`p-3 cursor-pointer transition relative ${
                      selectedUser?.id === conv.id ? `${colors.primaryLight}` : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarColor(index)} flex items-center justify-center text-white font-bold shadow-md`}>
                          {conv.name.charAt(0).toUpperCase()}
                        </div>
                        {conv.online && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow"></span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-gray-800 truncate">{conv.name}</p>
                          <span className="text-xs text-gray-400">12:42</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
                      </div>
                    </div>
                    
                    {conv.unread > 0 && (
                      <span className={`absolute right-3 top-3 ${colors.primary} text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow`}>
                        {conv.unread}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 h-full flex items-center justify-center">
                  <div>
                    <Users size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="font-medium">No conversations found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Chat content */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {/* Chat header */}
            {selectedUser ? (
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.highlight} flex items-center justify-center text-white shadow-md`}>
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{selectedUser.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span className={`inline-block w-2 h-2 rounded-full ${selectedUser.online ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                      {selectedUser.online ? 'Online Now' : 'Offline'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                    <MoreHorizontal size={18} />
                  </button>
                  <button 
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    onClick={() => deleteConversation(selectedUser.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            )}
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-100 bg-[url('/api/placeholder/800/800')] bg-opacity-25 bg-fixed bg-center">
              {selectedUser && messages[selectedUser.id] && messages[selectedUser.id].length > 0 ? (
                messages[selectedUser.id].map((message, index) => (
                  <div key={index} className={`flex mb-4 ${message.sender === "Admin" ? "justify-end" : "justify-start"}`}>
                    {message.sender !== "Admin" && (
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0 mr-2 shadow-sm flex items-center justify-center">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className={`max-w-md px-1`}>
                      <div
                        className={`p-3 rounded-2xl shadow-sm ${
                          message.sender === "Admin"
                            ? `bg-gradient-to-r ${colors.highlight} text-white`
                            : "bg-white text-gray-800"
                        }`}
                      >
                        {message.text}
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 ${message.sender === "Admin" ? "text-right mr-2" : "text-left ml-2"}`}>
                        {message.time || ""}
                      </div>
                    </div>
                    {message.sender === "Admin" && (
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-amber-300 to-orange-400 flex-shrink-0 ml-2 shadow-sm flex items-center justify-center">
                        A
                      </div>
                    )}
                  </div>
                ))
              ) : selectedUser ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-6 bg-white bg-opacity-90 rounded-2xl shadow-sm">
                    <div className={`mx-auto w-16 h-16 ${colors.primary} rounded-full flex items-center justify-center mb-4`}>
                      <MessageSquare size={28} className="text-white" />
                    </div>
                    <p className="font-bold text-gray-800 text-lg mb-1">No messages yet</p>
                    <p className="text-gray-500">Start the conversation with {selectedUser.name}</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-8 bg-white bg-opacity-90 rounded-2xl shadow-sm max-w-md">
                    <div className={`mx-auto w-16 h-16 ${colors.primary} rounded-full flex items-center justify-center mb-4`}>
                      <Users size={28} className="text-white" />
                    </div>
                    <p className="font-bold text-gray-800 text-lg mb-2">Welcome to Admin Chat</p>
                    <p className="text-gray-500 mb-4">Select a conversation from the list to start chatting with your customers</p>
                    <p className="text-sm text-gray-400">You have {totalUnread} unread messages</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Message input */}
            {selectedUser && (
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-gray-100 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-300 focus-within:bg-white transition-all duration-200">
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <Smile size={20} />
                    </button>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-gray-800"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <Paperclip size={20} />
                    </button>
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim() || !isConnected}
                    className={`p-3 rounded-xl ${
                      message.trim() && isConnected ? `${colors.primary} hover:opacity-90` : "bg-gray-200 cursor-not-allowed"
                    } transition duration-150 shadow-md`}
                  >
                    <Send size={18} className="text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}