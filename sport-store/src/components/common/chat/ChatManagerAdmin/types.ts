// Khai báo kiểu dữ liệu cho Message
export interface Message {
  sender: string;
  text: string;
  time?: string;
  senderId?: string;
  senderName?: string;
  timestamp?: string;
  messageId?: string;
}

export interface ServerMessage {
  senderId: string;
  senderName?: string;
  text: string;
  timestamp?: string;
  messageId?: string;
  conversationId?: string;
}

// Định nghĩa interface cho thông tin người dùng
export interface UserInfo {
  _id: string;
  id: string;
  name: string;
  email: string;
  fullName?: string;
  tempId?: string;
  phone?: string;
  totalSpent?: number;
}

// Định nghĩa interface cho hạng thành viên
export interface MembershipTier {
  name: string;
  color: string;
  icon: string;
}

// Định nghĩa interface cho cuộc trò chuyện
export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  isOnline?: boolean;
  userInfo?: UserInfo;
  membershipTier?: MembershipTier;
  status?: string;
  priority?: string;
  tags?: string[];
}

// Utility functions để dịch status và priority sang tiếng Việt
export const translateStatus = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Đang hoạt động';
    case 'normal':
      return 'Bình thường';
    case 'online':
      return 'Trực tuyến';
    case 'offline':
      return 'Ngoại tuyến';
    case 'away':
      return 'Vắng mặt';
    default:
      return status;
  }
};

export const translatePriority = (priority: string): string => {
  switch (priority) {
    case 'high':
      return 'Cao';
    case 'normal':
      return 'Bình thường';
    case 'low':
      return 'Thấp';
    default:
      return priority;
  }
};

// Theme configuration
export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryText: string;
  secondary: string;
  highlight: string;
  lightHighlight: string;
  border: string;
}

export type ThemeType = 'blue' | 'purple' | 'green'; 