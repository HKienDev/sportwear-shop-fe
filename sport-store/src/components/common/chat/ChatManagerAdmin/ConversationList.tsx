import React from 'react';
import { Conversation, ThemeColors, translateStatus, translatePriority } from './types';
import { Crown, Star, Medal, Gem } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  themeColors: ThemeColors;
  loading: boolean;
}

// Component để hiển thị icon membership tier
const MembershipIcon = ({ tier }: { tier: string }) => {
  switch (tier) {
    case 'Kim Cương':
      return <Gem size={12} />;
    case 'Bạch Kim':
      return <Crown size={12} />;
    case 'Vàng':
      return <Star size={12} />;
    case 'Bạc':
      return <Medal size={12} />;
    case 'Đồng':
      return <Medal size={12} />;
    default:
      return <Star size={12} />;
  }
};

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
    <div className="flex-1 bg-white/90 backdrop-blur-sm border-r border-slate-200">
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          Cuộc trò chuyện
        </h2>
        <p className="text-sm text-slate-600 mt-1">Quản lý tất cả cuộc trò chuyện</p>
      </div>
      
      <div className="overflow-y-auto h-full">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-500">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg font-medium mb-2">Chưa có cuộc trò chuyện nào</p>
              <p className="text-sm text-slate-400">Khách hàng sẽ xuất hiện ở đây khi họ bắt đầu chat</p>
            </div>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`p-4 border-b border-slate-100 cursor-pointer transition-all duration-300 hover:bg-slate-50/80 ${
                selectedConversation?.id === conversation.id 
                  ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-l-4 shadow-sm' 
                  : ''
              }`}
              style={{
                borderLeftColor: selectedConversation?.id === conversation.id ? themeColors.primary : 'transparent'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <h3 
                        className="text-sm font-semibold text-slate-900 truncate"
                        style={{
                          color: conversation.membershipTier?.color || '#374151'
                        }}
                      >
                        {conversation.name}
                      </h3>
                      {conversation.membershipTier && (
                        <span 
                          className="text-xs px-2 py-1 rounded-full font-medium shadow-sm flex items-center gap-1"
                          style={{
                            backgroundColor: `${conversation.membershipTier.color}20`,
                            color: conversation.membershipTier.color,
                            border: `1px solid ${conversation.membershipTier.color}40`
                          }}
                        >
                          <MembershipIcon tier={conversation.membershipTier.name} />
                          <span className="text-xs font-medium">{conversation.membershipTier.name}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 truncate mb-3 leading-relaxed">
                    {conversation.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {conversation.status && (
                        <span 
                          className="px-3 py-1 text-xs rounded-full font-medium shadow-sm"
                          style={{
                            backgroundColor: conversation.status === 'active' ? themeColors.primaryLight : '#FEF3C7',
                            color: conversation.status === 'active' ? themeColors.primaryText : '#92400E'
                          }}
                        >
                          {translateStatus(conversation.status)}
                        </span>
                      )}
                      
                      {conversation.priority && (
                        <span 
                          className="px-3 py-1 text-xs rounded-full font-medium shadow-sm"
                          style={{
                            backgroundColor: conversation.priority === 'high' ? '#FEE2E2' : '#D1FAE5',
                            color: conversation.priority === 'high' ? '#DC2626' : '#065F46'
                          }}
                        >
                          {translatePriority(conversation.priority)}
                        </span>
                      )}
                    </div>
                    
                    {conversation.unread > 0 && (
                      <span 
                        className="px-3 py-1 text-xs rounded-full text-white font-bold shadow-lg"
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