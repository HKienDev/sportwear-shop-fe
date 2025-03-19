"use client";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Search, Send, Trash2, Phone, Video, MoreVertical, Paperclip, Smile } from "lucide-react";

const socket = io("http://localhost:4000");

// Khai báo kiểu dữ liệu cho Conversation
interface Conversation {
  id: string; // hoặc number nếu ID là số
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
}

export default function AdminChat() {
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null); // Kiểu dữ liệu rõ ràng
  const [conversations, setConversations] = useState<Conversation[]>([]); // Kiểu dữ liệu rõ ràng
  const [messages, setMessages] = useState<Record<string, Message[]>>({}); // Kiểu dữ liệu rõ ràng
  const [searchQuery, setSearchQuery] = useState("");

  // Load dữ liệu từ localStorage khi component được mount
  useEffect(() => {
    const savedConversations = localStorage.getItem("conversations");
    const savedMessages = localStorage.getItem("messages");

    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Lưu dữ liệu vào localStorage khi conversations hoặc messages thay đổi
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [conversations, messages]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // Kiểm tra xem người dùng đã tồn tại trong danh sách cuộc trò chuyện chưa
      const userExists = conversations.some((conv) => conv.id === msg.senderId);

      if (!userExists) {
        // Thêm người dùng mới vào danh sách cuộc trò chuyện
        setConversations((prev) => [
          ...prev,
          {
            id: msg.senderId,
            name: msg.senderName || "Unknown", // Đảm bảo name luôn có giá trị
            lastMessage: msg.text,
            online: true,
            unread: 1,
          },
        ]);
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
      setMessages((prev) => ({
        ...prev,
        [msg.senderId]: [...(prev[msg.senderId] || []), { sender: msg.senderName, text: msg.text, time }],
      }));
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedUser, conversations]); // Thêm `conversations` vào dependency array

  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Gửi tin nhắn qua socket
    socket.emit("sendMessage", { text: message, recipientId: selectedUser.id });

    // Lưu tin nhắn vào lịch sử
    setMessages((prev) => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), { sender: "Admin", text: message, time }],
    }));

    // Cập nhật tin nhắn cuối cùng trong danh sách cuộc trò chuyện
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedUser.id ? { ...conv, lastMessage: message, unread: 0 } : conv
      )
    );

    setMessage("");
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!conv || typeof conv.name !== "string") return false; // Kiểm tra conv.name
    return conv.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar danh sách tin nhắn */}
      <div className="w-1/3 border-r border-gray-200 bg-white shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 flex items-center justify-between">
            ADMIN CHAT
            <button className="p-2 rounded-full hover:bg-gray-200 transition">
              <MoreVertical size={20} className="text-gray-600" />
            </button>
          </h1>
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-116px)]">
          {filteredConversations.map((conv, index) => (
            <div
              key={conv.id || index} // Sử dụng `conv.id` nếu có, nếu không dùng `index`
              onClick={() => {
                setSelectedUser(conv);
                // Đặt số tin nhắn chưa đọc về 0 khi chọn người dùng
                setConversations((prev) =>
                  prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c))
                );
              }}
              className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition relative ${
                selectedUser?.id === conv.id ? "bg-blue-50" : ""
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                  {conv.name.charAt(0)}
                </div>
                {conv.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">{conv.name}</p>
                  <p className="text-xs text-gray-500">12:30</p>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-500 truncate w-48">{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Khung chat chính */}
      <div className="w-2/3 flex flex-col bg-white">
        {/* Header chat */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm">
          {selectedUser ? (
            <>
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-800">{selectedUser.name}</p>
                  <p className="text-sm text-green-500">Đang hoạt động</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                  <Phone size={20} className="text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                  <Video size={20} className="text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                  <Trash2 size={20} className="text-red-500" />
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Chọn một cuộc trò chuyện</p>
          )}
        </div>

        {/* Tin nhắn */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
          {selectedUser && messages[selectedUser.id] ? (
            messages[selectedUser.id].map((message, index) => (
              <div key={index} className={`flex ${message.sender === "Admin" ? "justify-end" : "justify-start"}`}>
                {message.sender !== "Admin" && (
                  <div className="mr-2 self-end">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                      {selectedUser.name.charAt(0)}
                    </div>
                  </div>
                )}
                <div className={`max-w-md ${message.sender === "Admin" ? "order-1" : "order-2"}`}>
                  <div
                    className={`p-3 rounded-2xl ${
                      message.sender === "Admin"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-gray-200 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    {message.text}
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 ${message.sender === "Admin" ? "text-right" : "text-left"}`}>
                    {message.time || ""}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Không có tin nhắn</p>
          )}
        </div>

        {/* Nhập tin nhắn */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-2">
            <button className="p-2 rounded-full hover:bg-gray-200 transition">
              <Paperclip size={20} className="text-gray-600" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-3 py-2 bg-transparent focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button className="p-2 rounded-full hover:bg-gray-200 transition mr-1">
              <Smile size={20} className="text-gray-600" />
            </button>
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className={`p-2 rounded-full ${
                message.trim() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300"
              } transition`}
            >
              <Send size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}