import React from 'react';
import { Conversation } from './types';
import { ThemeColors } from './types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  themeColors: ThemeColors;
  loading: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  themeColors,
  loading
}) => {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 48) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Cuộc trò chuyện</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: themeColors.primary }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Cuộc trò chuyện</h2>
      </div>
      
      <div className="overflow-y-auto h-[calc(100vh-200px)]">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">💬</div>
              <p>Chưa có cuộc trò chuyện nào</p>
            </div>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${
                selectedConversation?.id === conversation.id 
                  ? 'bg-blue-50 border-l-4' 
                  : ''
              }`}
              style={{
                borderLeftColor: selectedConversation?.id === conversation.id ? themeColors.primary : 'transparent'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate mb-2">
                    {conversation.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {conversation.status && (
                        <span 
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: conversation.status === 'active' ? themeColors.primaryLight : '#FEF3C7',
                            color: conversation.status === 'active' ? themeColors.primaryText : '#92400E'
                          }}
                        >
                          {conversation.status}
                        </span>
                      )}
                      
                      {conversation.priority && (
                        <span 
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: conversation.priority === 'high' ? '#FEE2E2' : '#D1FAE5',
                            color: conversation.priority === 'high' ? '#DC2626' : '#065F46'
                          }}
                        >
                          {conversation.priority}
                        </span>
                      )}
                    </div>
                    
                    {conversation.unread > 0 && (
                      <span 
                        className="px-2 py-1 text-xs rounded-full text-white font-medium"
                        style={{ backgroundColor: themeColors.primary }}
                      >
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 