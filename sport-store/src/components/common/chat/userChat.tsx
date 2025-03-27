"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { MessageCircle, X, Send, ChevronDown, User, Clock } from "lucide-react";

const socket = io("http://localhost:4000");

export default function UserChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string; time?: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping] = useState(false);
  const [newMessageAlert, setNewMessageAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      // Add timestamp to incoming messages
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      setMessages((prev) => [...prev, {...msg, time}]);
      
      // Show new message alert if chat is closed
      if (!isOpen) {
        setNewMessageAlert(true);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    
    // Add timestamp to sent messages
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    socket.emit("sendMessage", { text: message });
    setMessages((prev) => [...prev, { sender: "User", text: message, time }]);
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
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <User size={16} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Hỗ trợ trực tuyến</h3>
                <p className="text-xs text-blue-100 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                  Trực tuyến
                </p>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              className="p-1 rounded-full hover:bg-blue-700 transition-colors"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Welcome message */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              Xin chào! Bạn cần hỗ trợ gì? Nhân viên của chúng tôi sẽ phản hồi trong thời gian sớm nhất.
            </p>
          </div>

          {/* Messages container */}
          <div className="h-64 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                <p>Bắt đầu cuộc trò chuyện...</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-3 flex ${msg.sender === "User" ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-3/4">
                    <div 
                      className={`px-4 py-2 rounded-2xl text-sm inline-block ${
                        msg.sender === "User" 
                          ? "bg-blue-600 text-white rounded-br-none" 
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div 
                      className={`flex items-center text-xs text-gray-500 mt-1 ${
                        msg.sender === "User" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <Clock size={12} className="mr-1" />
                      {msg.time || "Vừa xong"}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex items-center text-gray-500 text-sm mb-3">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                  <User size={12} className="text-gray-500" />
                </div>
                <div className="bg-gray-200 px-3 py-2 rounded-xl rounded-bl-none inline-block">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center bg-gray-50 rounded-full px-3 py-1 border border-gray-200">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-transparent py-2 px-2 outline-none text-sm"
              />
              <button 
                onClick={sendMessage}
                disabled={!message.trim()}
                className={`p-2 rounded-full ${
                  message.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300"
                } transition-colors`}
              >
                <Send size={16} className="text-white" />
              </button>
            </div>
            <div className="text-xs text-gray-400 text-center mt-2">
              Support by VJU Sport
            </div>
          </div>
        </div>
      )}
    </div>
  );
}