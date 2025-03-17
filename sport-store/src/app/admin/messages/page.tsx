'use client';
import React, { useState } from "react";
import Image from "next/image";
import { Search, Send, Trash2, Phone, Video, MoreVertical, Paperclip, Smile } from "lucide-react";

const ChatUI = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  
  const contacts = [
    { id: 1, name: "Hoàng Tiến Trung Kiên", lastMessage: "Oke anh", online: true, unread: 2 },
    { id: 2, name: "Nguyễn Văn A", lastMessage: "Hẹn gặp lại sau", online: false, unread: 0 },
    { id: 3, name: "Trần Thị B", lastMessage: "Cảm ơn bạn nhiều!", online: true, unread: 5 },
    { id: 4, name: "Lê Văn C", lastMessage: "Tôi sẽ gửi báo cáo vào ngày mai", online: false, unread: 0 },
    { id: 5, name: "Phạm Thị D", lastMessage: "Đã nhận được hàng", online: true, unread: 0 },
    { id: 6, name: "Vũ Văn E", lastMessage: "Hẹn bạn 2h chiều nhé", online: false, unread: 1 },
    { id: 7, name: "Mai Thị F", lastMessage: "File đính kèm đã được gửi", online: true, unread: 0 },
    { id: 8, name: "Đỗ Văn G", lastMessage: "Xin chào", online: true, unread: 0 },
    { id: 9, name: "Ngô Thị H", lastMessage: "Cảm ơn", online: false, unread: 0 },
    { id: 10, name: "Đinh Văn I", lastMessage: "OK", online: true, unread: 0 },
  ];

  const messages = [
    { id: 1, sender: "them", text: "Chào bạn! Tôi muốn hỏi thêm về sản phẩm của công ty.", time: "09:15" },
    { id: 2, sender: "me", text: "Chào bạn, rất vui được hỗ trợ. Bạn cần thông tin về sản phẩm nào?", time: "09:16" },
    { id: 3, sender: "them", text: "Tôi đang quan tâm đến model XYZ-200. Bạn có thể cho tôi biết giá và tính năng được không?", time: "09:18" },
    { id: 4, sender: "me", text: "Dạ, model XYZ-200 có giá 5.500.000đ, tính năng chính gồm kết nối không dây, thời lượng pin 48h, chống nước chuẩn IPX7.", time: "09:20" },
    { id: 5, sender: "them", text: "Thông tin sản phẩm thật tuyệt vời! Còn bảo hành thì sao?", time: "09:22" },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Logic gửi tin nhắn sẽ được thêm vào đây
      setMessageInput("");
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar danh sách tin nhắn */}
      <div className="w-1/3 border-r border-gray-200 bg-white shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 flex items-center justify-between">
            TIN NHẮN
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
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition relative"
            >
              <div className="relative">
                <Image src="/cuoc.png" alt="Avatar" width={48} height={48} className="rounded-full object-cover" />
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">{contact.name}</p>
                  <p className="text-xs text-gray-500">12:30</p>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-500 truncate w-48">{contact.lastMessage}</p>
                  {contact.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {contact.unread}
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
          <div className="flex items-center">
            <div className="relative">
              <Image src="/cuoc.png" alt="Avatar" width={48} height={48} className="rounded-full object-cover" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-3">
              <p className="font-semibold text-gray-800">Hoàng Tiến Trung Kiên</p>
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
        </div>

        {/* Tin nhắn */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
              {message.sender === "them" && (
                <div className="mr-2 self-end">
                  <Image src="/cuoc.png" alt="Avatar" width={32} height={32} className="rounded-full" />
                </div>
              )}
              <div className={`max-w-md ${message.sender === "me" ? "order-1" : "order-2"}`}>
                <div 
                  className={`p-3 rounded-2xl ${
                    message.sender === "me" 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-gray-200 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {message.text}
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${message.sender === "me" ? "text-right" : "text-left"}`}>
                  {message.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nhập tin nhắn */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-2">
            <button className="p-2 rounded-full hover:bg-gray-200 transition">
              <Paperclip size={20} className="text-gray-600" />
            </button>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-3 py-2 bg-transparent focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="p-2 rounded-full hover:bg-gray-200 transition mr-1">
              <Smile size={20} className="text-gray-600" />
            </button>
            <button 
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className={`p-2 rounded-full ${
                messageInput.trim() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300"
              } transition`}
            >
              <Send size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;