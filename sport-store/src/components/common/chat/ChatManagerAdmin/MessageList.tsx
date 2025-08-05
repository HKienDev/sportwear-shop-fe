import React, { useRef, useEffect } from 'react';
import { Message, ThemeColors } from './types';

interface MessageListProps {
  messages: Message[];
  themeColors: ThemeColors;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  themeColors,
  loading,
  error,
  onRetry
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 p-4">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: themeColors.primary }}></div>
            <p className="text-gray-500">Đang tải tin nhắn...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-gray-50 p-4">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-gray-700 mb-2">Không thể tải tin nhắn</p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200"
              style={{ backgroundColor: themeColors.primary }}
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 bg-gray-50 p-4">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-gray-500">Chưa có tin nhắn nào</p>
            <p className="text-gray-400 text-sm">Bắt đầu cuộc trò chuyện!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-50/50 to-blue-50/30 overflow-y-auto p-6 flex flex-col">
      <div className="flex-1 space-y-4">
        {messages.map((message, index) => {
          const isAdmin = message.sender === 'admin' || message.senderId === 'admin';
          
          return (
            <div
              key={message.messageId || index}
              className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} group`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md ${
                  isAdmin 
                    ? 'rounded-br-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                    : 'rounded-bl-md bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-800'
                }`}
              >
                <div className="text-sm leading-relaxed">{message.text}</div>
                <div 
                  className={`text-xs mt-2 flex items-center gap-1 ${
                    isAdmin ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  <span>{formatTime(message.time || message.timestamp || new Date().toISOString())}</span>
                  {isAdmin && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}; 