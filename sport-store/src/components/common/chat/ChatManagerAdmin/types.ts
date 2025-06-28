// Khai báo kiểu dữ liệu cho Conversation
export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
  lastMessageTime: string;
  userInfo: UserInfo | null;
  status?: string;
  priority?: string;
  tags?: string[];
}

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
}

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