"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { MessageCircle, X, Send, User, Edit, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

// Hàm để lấy socket URL
const getSocketUrl = () => {
  const apiUrl: string = process.env.NEXT_PUBLIC_API_URL || '';
  
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
console.log('🔌 User Chat - Socket URL:', SOCKET_URL);

// Tạo socket instance với error handling tốt hơn
let socket: Socket | null = null;

try {
  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
    forceNew: false // Thay đổi từ true thành false để tránh tạo connection mới
  });
} catch (error) {
  console.error('❌ Error creating socket connection:', error);
  socket = null;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  gender: string;
}

interface IdentificationData {
  status: string;
  role: string;
  socketId: string;
  userId: string;
}

interface SocketError {
  message: string;
  type?: string;
  code?: string;
}

interface ChatMessage {
  text: string;
  senderId: string;
  senderName: string;
  timestamp?: string;
}

// Custom Dropdown Component
const CustomDropdown = ({ 
  value, 
  onChange, 
  options, 
  placeholder 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  options: { value: string; label: string }[]; 
  placeholder: string; 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative z-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white cursor-pointer hover:border-gray-400 transition-colors text-left ${
          value ? 'text-gray-900' : 'text-gray-500'
        }`}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-200 ${
                option.value === value ? 'bg-red-50 text-red-600' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function UserChat({ height = "h-80" }: { height?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([]);
  const [newMessageAlert, setNewMessageAlert] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    phone: "",
    gender: "Anh"
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevAuthState = useRef<boolean | null>(null);
  
  // Lấy thông tin user đã login
  const { user, isAuthenticated, loading } = useAuth();

  // Debug logs
  useEffect(() => {
    console.log('🔍 UserChat - Auth status:', { isAuthenticated, loading, user });
  }, [isAuthenticated, loading, user]);

  // Cập nhật userInfo khi user đã login
  useEffect(() => {
    console.log('🔍 UserChat - Updating userInfo:', { isAuthenticated, loading, user });
    if (isAuthenticated && user && !loading) {
      console.log('🔍 UserChat - Setting userInfo from user:', {
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        gender: user.gender
      });
      setUserInfo({
        name: user.fullname || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender === "female" ? "Chị" : "Anh"
      });
      
      // Load chat history khi user login
      console.log('🔍 UserChat - User authenticated, loading chat history');
      loadChatHistory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, loading]);

  // Force re-identification function
  const forceReidentify = useCallback(() => {
    if (socket && socket.connected) {
      console.log('🔍 UserChat - Force re-identifying user due to auth state change');
      
      // Xác định userId dựa trên trạng thái authentication
      let userId;
      if (isAuthenticated && user) {
        userId = user._id;
        console.log('🔍 UserChat - Re-identifying as authenticated user:', userId);
      } else {
        // Khách vãng lai: tạo session tạm thời mới mỗi lần
        userId = "temp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
        console.log('🔍 UserChat - Creating new temp session for guest:', userId);
      }
      
      // Cập nhật localStorage với userId hiện tại
      localStorage.setItem('currentUserId', userId);
      
      // Xác định danh tính với server
      const userName = isAuthenticated && user ? user.fullname : userInfo.name || "User";
      socket.emit("identifyUser", { 
        userId, 
        userName, 
        isAdmin: false,
        userInfo: isAuthenticated && user ? {
          fullname: user.fullname,
          email: user.email,
          phone: user.phone
        } : null
      });
      console.log('🔍 UserChat - Re-identification sent for user:', { userId, userName });
    }
  }, [isAuthenticated, user, userInfo.name]);

  // Force re-identification khi authentication state thay đổi
  useEffect(() => {
    if (socket && socket.connected) {
      // Nếu user logout (isAuthenticated = false), clear userId để force tạo mới
      if (!isAuthenticated) {
        console.log('🔍 UserChat - User logged out, clearing userId');
        localStorage.removeItem('currentUserId');
        // Không cần clear tempUserId vì sẽ tạo mới mỗi lần
      }
      
      // Disconnect và reconnect để đảm bảo clean state
      if (isAuthenticated !== prevAuthState.current) {
        console.log('🔍 UserChat - Auth state changed, reconnecting socket');
        // Remove listeners trước khi disconnect
        socket.off("connect");
        socket.off("identified");
        socket.off("disconnect");
        socket.off("connect_error");
        socket.off("receiveMessage");
        
        socket.disconnect();
        socket.connect();
        prevAuthState.current = isAuthenticated;
      } else {
        forceReidentify();
      }
    }
  }, [isAuthenticated, user, forceReidentify]);

  // Xác định danh tính khi kết nối
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      
      // Xác định userId dựa trên trạng thái authentication
      let userId;
      if (isAuthenticated && user) {
        // User đã login - sử dụng _id từ user
        userId = user._id;
        console.log("🔍 UserChat - User is authenticated, using userId:", userId);
      } else {
        // User chưa login - sử dụng userId từ localStorage hoặc tạo mới
        userId = localStorage.getItem("tempUserId");
        if (!userId) {
          userId = "temp_" + Math.random().toString(36).substring(2, 9);
          localStorage.setItem("tempUserId", userId);
        }
        console.log("🔍 UserChat - User is not authenticated, using tempUserId:", userId);
      }
      
      // Cập nhật localStorage với userId hiện tại
      localStorage.setItem("currentUserId", userId);
      
      console.log("🔍 UserChat - Using userId:", userId);
      
      // Xác định danh tính với server
      const userName = isAuthenticated && user ? user.fullname : userInfo.name || "User";
      socket.emit("identifyUser", { 
        userId, 
        userName, 
        isAdmin: false,
        userInfo: isAuthenticated && user ? {
          fullname: user.fullname,
          email: user.email,
          phone: user.phone
        } : null
      });
      console.log("Sent identifyUser event for user:", { userId, userName });
    };

    const handleIdentified = (data: IdentificationData) => {
      console.log("Identification response:", data);
      if (data.status === 'success' && data.role === 'user') {
        console.log("User successfully identified with socket ID:", data.socketId);
        console.log("🔍 UserChat - User joined room: user_" + data.userId);
      }
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    const handleConnectError = (error: SocketError) => {
      console.error("Socket connection error:", error);
    };

    socket.on("connect", handleConnect);
    socket.on("identified", handleIdentified);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("identified", handleIdentified);
        socket.off("disconnect", handleDisconnect);
        socket.off("connect_error", handleConnectError);
      }
    };
  }, [userInfo.name, isAuthenticated, user]); // Thêm dependencies để re-run khi user thay đổi

  // Nhận tin nhắn từ admin
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg: ChatMessage) => {
      console.log("🔍 UserChat - Received message:", msg);
      
      // Kiểm tra xem tin nhắn đã tồn tại chưa để tránh hiển thị trùng lặp
      const messageExists = messages.some(
        (m) => m.text === msg.text && m.sender === msg.senderName
      );
      
      if (!messageExists) {
        console.log("🔍 UserChat - Adding new message to UI");
        
        setMessages((prev) => [...prev, {
          sender: msg.senderId === 'admin' ? 'admin' : 'user',
          text: msg.text,
          time: msg.timestamp || new Date().toISOString()
        }]);
        
        // Show new message alert if chat is closed
        if (!isOpen) {
          setNewMessageAlert(true);
        }
      } else {
        console.log("🔍 UserChat - Message already exists, skipping");
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      if (socket) {
        socket.off("receiveMessage", handleReceiveMessage);
      }
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
    if (!message.trim() || !socket) return;

    // Get or create user ID
    let userId = localStorage.getItem("currentUserId");
    if (!userId) {
      if (isAuthenticated && user) {
        // Sử dụng userId từ user đã login
        userId = user._id || `user_${user._id}`;
      } else {
        // Khách vãng lai: tạo session tạm thời mới
        userId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      localStorage.setItem("currentUserId", userId);
    }
    const userName = userInfo.name || "User";
    socket.emit("sendMessage", {
      text: message,
      userId,
      userName
    });

    setMessages(prev => [...prev, { 
      sender: "user", 
      text: message, 
      time: new Date().toISOString() 
    }]);
    setMessage("");
    scrollToBottom();
    
    // Toast cho tin nhắn đã gửi
    toast.success("Tin nhắn đã gửi!");
  };

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (!newIsOpen) {
      // Khi đóng chat
      setNewMessageAlert(false);
      
      // Nếu là khách vãng lai và đã có tin nhắn, xóa tin nhắn
      if (!isAuthenticated && messages.length > 0) {
        const currentUserId = localStorage.getItem('currentUserId');
        if (currentUserId && currentUserId.startsWith('temp_')) {
          console.log('🔍 UserChat - Guest closing chat, clearing messages for:', currentUserId);
          
          // Xóa tin nhắn từ backend
          fetch('/api/chat/clear-guest-messages', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: currentUserId }),
          }).catch(error => {
            console.error('❌ Error clearing guest messages:', error);
          });
        }
      }
    } else {
      // Khi mở chat, reset state cho khách vãng lai
      if (!isAuthenticated) {
        console.log('🔍 UserChat - Guest opening chat, resetting state');
        setMessages([]);
        setIsChatStarted(false);
        setMessage("");
        setUserInfo({
          name: "",
          email: "",
          phone: "",
          gender: "Anh"
        });
        // Tạo session mới cho khách vãng lai
        const newUserId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('currentUserId', newUserId);
        console.log('🔍 UserChat - Created new session for guest:', newUserId);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const startChat = async () => {
    try {
      console.log('🔍 UserChat - Starting chat...');
      
      if (!socket) {
        console.error('❌ Socket not available');
        toast.error('Lỗi kết nối. Vui lòng thử lại!');
        return;
      }
      
      // Validate thông tin cho khách vãng lai
      if (!isAuthenticated) {
        const isValid = await validateUserInfo();
        if (!isValid) {
          console.log('🔍 UserChat - Validation failed for guest user');
          return;
        }
      }
      
      // Get or create user ID
      let userId = localStorage.getItem('currentUserId');
      if (!userId) {
        if (isAuthenticated && user) {
          userId = user._id;
        } else {
          // Khách vãng lai: tạo session tạm thời mới
          userId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        localStorage.setItem('currentUserId', userId);
      }
      const userName = userInfo.name || "User";
      
      console.log('🔍 UserChat - Using userId:', userId, 'userName:', userName);
      
      // Xác định danh tính với server
      socket.emit("identifyUser", { 
        userId, 
        userName, 
        isAdmin: false,
        userInfo: isAuthenticated && user ? {
          fullname: user.fullname,
          email: user.email,
          phone: user.phone
        } : null
      });
      
      // Load chat history nếu user đã login
      if (isAuthenticated && user) {
        console.log('🔍 UserChat - Loading chat history for authenticated user');
        await loadChatHistory();
      }
      
      setIsChatStarted(true);
      console.log('🔍 UserChat - Chat started successfully');
      
    } catch (error) {
      console.error('❌ Error starting chat:', error);
      toast.error('Lỗi khởi tạo chat. Vui lòng thử lại!');
    }
  };

  const handleUserInfoChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Real-time validation cho email
    if (field === 'email' && value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
        // Không hiển thị toast ngay, chỉ validate khi submit
      }
    }
    
    // Real-time validation cho số điện thoại
    if (field === 'phone' && value.trim()) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(value.trim())) {
        // Không hiển thị toast ngay, chỉ validate khi submit
      }
    }
  };

  const toggleEditInfo = () => {
    setIsEditingInfo(!isEditingInfo);
  };

  // Validate thông tin trước khi lưu
  const validateUserInfo = async () => {
    // Kiểm tra tên
    if (!userInfo.name.trim()) {
      toast.error("Vui lòng nhập tên!");
      return false;
    }

    // Kiểm tra số điện thoại
    if (!userInfo.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại!");
      return false;
    }

    // Validate format số điện thoại
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(userInfo.phone.trim())) {
      toast.error("Số điện thoại không đúng định dạng!");
      return false;
    }

    // Validate email nếu có nhập
    if (userInfo.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userInfo.email.trim())) {
        toast.error("Email không đúng định dạng!");
        return false;
      }
    }

    // Validate với server nếu có email hoặc phone
    if (userInfo.email.trim() || userInfo.phone.trim()) {
      try {
        console.log('🔍 UserChat - Validating:', { phone: userInfo.phone, email: userInfo.email });
        
        const response = await fetch('/api/chat/validate-phone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            phone: userInfo.phone,
            email: userInfo.email 
          }),
        });
        
        const data = await response.json();
        console.log('🔍 UserChat - Validation response:', data);
        
        if (data.success && data.isUsed) {
          toast.error(data.message);
          return false;
        }
      } catch (error) {
        console.error('❌ Error validating phone:', error);
        toast.error('Lỗi kiểm tra thông tin. Vui lòng thử lại!');
        return false;
      }
    }

    return true;
  };

  // Load chat history cho user đã login
  const loadChatHistory = useCallback(async () => {
    if (!isAuthenticated || !user) {
      console.log('🔍 UserChat - Cannot load chat history: not authenticated or no user');
      return;
    }
    
    try {
      console.log('🔍 UserChat - Loading chat history for user:', user._id);
      
      const response = await fetch(`/api/chat/history/${user._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('🔍 UserChat - Chat history response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 UserChat - Chat history data:', data);
        
        if (data.success && data.messages) {
          const formattedMessages = data.messages.map((msg: { senderId: string; text: string; timestamp?: string; createdAt?: string }) => ({
            sender: msg.senderId === 'admin' ? 'admin' : 'user',
            text: msg.text,
            time: msg.timestamp || msg.createdAt
          }));
          console.log('🔍 UserChat - Formatted messages:', formattedMessages);
          setMessages(formattedMessages);
        } else {
          console.log('🔍 UserChat - No messages found or invalid response');
        }
      } else {
        console.error('🔍 UserChat - Chat history request failed:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('🔍 UserChat - Error data:', errorData);
      }
    } catch (error) {
      console.error('❌ Error loading chat history:', error);
    }
  }, [isAuthenticated, user]);

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
          <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg">Chat với nhân viên tư vấn</h3>
                <p className="text-sm font-medium text-red-100">Em ở đây để hỗ trợ cho mình ạ</p>
              </div>
            </div>
            <button onClick={toggleChat} className="text-red-100 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {!isChatStarted ? (
            /* User Info Form */
            <div className="p-4 bg-white">
              {/* User Info Display */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4 relative">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {isAuthenticated && user ? user.fullname || "Chưa có tên" : userInfo.name || "Chưa có tên"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isAuthenticated && user ? user.email || "Chưa có email" : userInfo.email || "Chưa có email"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isAuthenticated && user ? user.phone || "Chưa có số điện thoại" : userInfo.phone || "Chưa có số điện thoại"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="text-gray-400">Giới tính:</span> {userInfo.gender}
                    </div>
                  </div>
                  {!isAuthenticated && (
                    <button 
                      onClick={toggleEditInfo}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Edit Form - chỉ hiển thị khi chưa login */}
              {isEditingInfo && !isAuthenticated && (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nhập tên của bạn*
                    </label>
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => handleUserInfoChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nhập tên của bạn"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nhập email của bạn
                    </label>
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => handleUserInfoChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nhập email của bạn"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nhập số điện thoại của bạn*
                    </label>
                    <input
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) => handleUserInfoChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại của bạn"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính
                    </label>
                    <CustomDropdown
                      value={userInfo.gender}
                      onChange={(value) => handleUserInfoChange('gender', value)}
                      options={[
                        { value: "Anh", label: "Anh" },
                        { value: "Chị", label: "Chị" },
                        { value: "Em", label: "Em" }
                      ]}
                      placeholder="Chọn giới tính"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      if (await validateUserInfo()) {
                        toggleEditInfo();
                        toast.success("Đã lưu thông tin!");
                      }
                    }}
                    className="w-full text-white py-2 rounded-lg transition font-semibold hover:opacity-90"
                    style={{ backgroundColor: '#4EB09D' }}
                  >
                    Lưu thông tin
                  </button>
                </div>
              )}

              {/* Start Chat Button - chỉ hiển thị khi không edit */}
              {!isEditingInfo && (
                <button
                  onClick={startChat}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2"
                >
                  <Send size={18} />
                  <span>
                    {isAuthenticated ? "BẮT ĐẦU CHAT" : "BẮT ĐẦU TRÒ CHUYỆN"}
                  </span>
                </button>
              )}

              {/* Info text - chỉ hiển thị khi không edit */}
              {!isEditingInfo && (
                isAuthenticated ? (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Sử dụng thông tin từ tài khoản đã đăng nhập
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Vui lòng nhập thông tin để bắt đầu chat
                  </p>
                )
              )}
            </div>
          ) : (
            /* Chat Messages */
            <>
              <div className={`${height} overflow-y-auto p-4 bg-gray-50 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}>
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <MessageCircle size={40} className="mb-2" />
                    <p>Chưa có tin nhắn nào</p>
                    <p className="text-sm">Hãy bắt đầu cuộc trò chuyện!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isUser = msg.sender === "user" || msg.sender === "User";
                    
                    // Format time đẹp hơn
                    const formatTime = (timeString: string) => {
                      try {
                        const date = new Date(timeString);
                        if (isNaN(date.getTime())) {
                          return new Date().toLocaleTimeString('vi-VN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          });
                        }
                        return date.toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        });
                      } catch {
                        return new Date().toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        });
                      }
                    };
                    
                    return (
                      <div
                        key={index}
                        className={`flex mb-3 ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[80%] ${isUser ? "order-1" : "order-2"}`}>
                          <div
                            className={`p-2.5 rounded-lg ${
                              isUser
                                ? "bg-blue-600 text-white rounded-tr-none"
                                : "bg-gray-600 text-white rounded-tl-none"
                            }`}
                          >
                            <div className="text-sm leading-relaxed">{msg.text}</div>
                            <div className={`text-xs mt-2 flex items-center gap-1 ${
                              isUser ? 'text-blue-100' : 'text-gray-200'
                            }`}>
                              <span>{formatTime(msg.time || new Date().toISOString())}</span>
                              {isUser && (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
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
                      message.trim() ? "bg-red-600 hover:bg-red-700" : "bg-gray-300"
                    } transition ml-2`}
                  >
                    <Send size={18} className="text-white" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 text-right">
            <span className="text-xs text-green-600 font-medium">Developed by HKienDev</span>
          </div>
        </div>
      )}
    </div>
  );
}