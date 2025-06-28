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
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-end space-x-3">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
            style={{
              minHeight: '44px',
              maxHeight: '120px'
            }}
            disabled={disabled || loading}
          />
        </div>
        
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || disabled || loading}
          className={`px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center ${
            message.trim() && !disabled && !loading
              ? 'text-white'
              : 'text-gray-400 bg-gray-100 cursor-not-allowed'
          }`}
          style={{
            backgroundColor: message.trim() && !disabled && !loading 
              ? themeColors.primary 
              : undefined
          }}
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
      
      <div className="mt-2 text-xs text-gray-500">
        Nhấn Enter để gửi, Shift + Enter để xuống dòng
      </div>
    </div>
  );
}; 