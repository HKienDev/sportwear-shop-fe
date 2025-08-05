import React, { useState, KeyboardEvent } from 'react';
import { ThemeColors } from './types';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  themeColors: ThemeColors;
  disabled?: boolean;
  loading?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  themeColors,
  disabled = false,
  loading = false
}) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() && !disabled && !loading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-6 bg-white/90 backdrop-blur-sm border-t border-slate-200">
      <div className="flex items-end space-x-4">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
            rows={1}
            style={{
              minHeight: '48px',
              maxHeight: '120px'
            }}
            disabled={disabled || loading}
          />
        </div>
        
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || disabled || loading}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg ${
            message.trim() && !disabled && !loading
              ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105'
              : 'text-slate-400 bg-slate-100 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
          <span>Nhấn Enter để gửi</span>
        </div>
        <span>•</span>
        <span>Shift + Enter để xuống dòng</span>
      </div>
    </div>
  );
}; 