import React from 'react';
import { Conversation, ThemeColors, translateStatus } from './types';
import { Crown, Star, Medal, Gem } from 'lucide-react';

interface ChatHeaderProps {
  conversation: Conversation | null;
  themeColors: ThemeColors;
  isConnected: boolean;
  onRefresh: () => void;
}

// Component để hiển thị icon membership tier
const MembershipIcon = ({ tier }: { tier: string }) => {
  switch (tier) {
    case 'Kim Cương':
      return <Gem size={14} />;
    case 'Bạch Kim':
      return <Crown size={14} />;
    case 'Vàng':
      return <Star size={14} />;
    case 'Bạc':
      return <Medal size={14} />;
    case 'Đồng':
      return <Medal size={14} />;
    default:
      return <Star size={14} />;
  }
};

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  themeColors,
  isConnected,
  onRefresh
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#10B981';
      case 'offline':
        return '#6B7280';
      case 'away':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-lg">💬</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Chọn cuộc trò chuyện</h3>
            <p className="text-sm text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-500">
            {isConnected ? 'Đã kết nối' : 'Mất kết nối'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: themeColors.primary }}
          >
            {conversation.name.charAt(0).toUpperCase()}
          </div>
          {conversation.userInfo && (
            <div 
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
              style={{ backgroundColor: getStatusColor(conversation.status || 'offline') }}
            ></div>
          )}
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 
              className="text-lg font-semibold text-gray-800"
              style={{
                color: conversation.membershipTier?.color || '#1F2937'
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
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {conversation.userInfo?.phone ? 
                conversation.userInfo.phone : 
                conversation.userInfo?.email ? 
                  conversation.userInfo.email : 
                  'Khách'
              }
            </span>
            {conversation.status && (
              <span 
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: conversation.status === 'active' ? themeColors.primaryLight : '#FEF3C7',
                  color: conversation.status === 'active' ? themeColors.primaryText : '#92400E'
                }}
              >
                {translateStatus(conversation.status)}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={onRefresh}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
          title="Làm mới"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-500">
            {isConnected ? 'Đã kết nối' : 'Mất kết nối'}
          </span>
        </div>
      </div>
    </div>
  );
}; 