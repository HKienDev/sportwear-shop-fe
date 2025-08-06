import { useState, useCallback } from 'react';
import { Conversation, Message } from './types';

// API base URL - use Next.js API routes
const API_BASE_URL = '/api';

// Raw types for API responses
interface RawConversation {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
  messageCount?: number;
  lastMessageTime: string;
  userInfo?: {
    fullname?: string;
    email?: string;
    phone?: string;
    totalSpent?: number;
  };
  membershipTier?: {
    name: string;
    color: string;
    icon: string;
  };
  status?: string;
  priority?: string;
  tags?: string[];
}

interface RawMessage {
  senderId?: string;
  sender?: string;
  text?: string;
  message?: string;
  timestamp?: string;
  time?: string;
  _id?: string;
  messageId?: string;
  senderName?: string;
  isAdmin?: boolean;
  isRead?: boolean;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Try to get from localStorage first
  const token = localStorage.getItem('accessToken');
  if (token) return token;
  
  // Try to get from cookies
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
  if (tokenCookie) {
    return tokenCookie.split('=')[1];
  }
  
  // Fallback to test token for development
  if (process.env.NODE_ENV === 'development') {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODVmMDdkODhhZWNhNDk3ZjI0YWZhM2YiLCJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUxMDU4MzkyLCJleHAiOjE3NTExNDQ3OTJ9.KZ8y71CZk7mJUYLrZf3DQ5jNsyUXCoVO21q_Yemi_oY';
  }
  
  return null;
};

export const useChatAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách cuộc trò chuyện
  const fetchConversations = useCallback(async (): Promise<Conversation[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${API_BASE_URL}/chat/conversations`;
      
      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      let conversationsData: RawConversation[] = [];
      
      if (Array.isArray(data)) {
        conversationsData = data as RawConversation[];
      } else if (data && typeof data === 'object') {
        if (data.conversations && Array.isArray(data.conversations)) {
          conversationsData = data.conversations as RawConversation[];
        } else if (data.data && data.data.conversations && Array.isArray(data.data.conversations)) {
          conversationsData = data.data.conversations as RawConversation[];
        } else if (data.data && Array.isArray(data.data)) {
          conversationsData = data.data as RawConversation[];
        } else if (data.success && data.data && data.data.conversations && Array.isArray(data.data.conversations)) {
          conversationsData = data.data.conversations as RawConversation[];
        } else if (Object.keys(data).length === 0) {
          conversationsData = [];
        } else {
          conversationsData = [];
        }
      } else {
        conversationsData = [];
      }
      
      const conversations: Conversation[] = conversationsData.map((conv: RawConversation) => ({
        id: conv.id || '',
        name: conv.name || 'Unknown User',
        lastMessage: conv.lastMessage || 'No messages yet',
        unread: conv.unread || 0,
        lastMessageTime: conv.lastMessageTime || new Date().toISOString(),
        userInfo: conv.userInfo ? {
          _id: conv.id || '',
          id: conv.id || '',
          name: conv.userInfo.fullname || 'Unknown',
          email: conv.userInfo.email || '',
          fullName: conv.userInfo.fullname,
          tempId: undefined,
          phone: conv.userInfo.phone,
          totalSpent: conv.userInfo.totalSpent
        } : undefined,
        status: conv.status || 'active',
        priority: conv.priority || 'normal',
        tags: conv.tags || [],
        membershipTier: conv.membershipTier || undefined
      }));

      return conversations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch conversations';
      console.error('❌ Error fetching conversations:', errorMessage);
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy tin nhắn của một cuộc trò chuyện
  const fetchMessages = useCallback(async (conversationId: string): Promise<Message[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${API_BASE_URL}/chat/messages/${conversationId}`;
      
      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      let messagesData: RawMessage[] = [];
      
      if (Array.isArray(data)) {
        messagesData = data as RawMessage[];
      } else if (data && typeof data === 'object') {
        if (data.messages && Array.isArray(data.messages)) {
          messagesData = data.messages as RawMessage[];
        } else if (data.data && data.data.messages && Array.isArray(data.data.messages)) {
          messagesData = data.data.messages as RawMessage[];
        } else if (data.data && Array.isArray(data.data)) {
          messagesData = data.data as RawMessage[];
        } else if (data.success && data.data && data.data.messages && Array.isArray(data.data.messages)) {
          messagesData = data.data.messages as RawMessage[];
        } else if (Object.keys(data).length === 0) {
          messagesData = [];
        } else {
          messagesData = [];
        }
      } else {
        messagesData = [];
      }

      const messages: Message[] = messagesData.map((msg: RawMessage) => ({
        sender: msg.senderId || msg.sender || 'Unknown',
        text: msg.text || msg.message || '',
        time: msg.timestamp || msg.time || new Date().toISOString(),
        senderId: msg.senderId,
        senderName: msg.senderName || msg.sender,
        timestamp: msg.timestamp || msg.time,
        messageId: msg.messageId || msg._id
      }));

      return messages;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
      console.error('❌ Error fetching messages:', errorMessage);
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Gửi tin nhắn
  const sendMessage = useCallback(async (conversationId: string, message: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${API_BASE_URL}/chat/send`;
      
      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          conversationId,
          message,
          senderId: 'admin',
          senderName: 'Admin'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      console.error('❌ Error sending message:', errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Đánh dấu đã đọc
  const markAsRead = useCallback(async (conversationId: string): Promise<boolean> => {
    try {
      const url = `${API_BASE_URL}/chat/mark-read/${conversationId}`;
      
      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark as read';
      console.error('❌ Error marking as read:', errorMessage);
      return false;
    }
  }, []);

  return {
    fetchConversations,
    fetchMessages,
    sendMessage,
    markAsRead,
    loading,
    error,
    clearError: () => setError(null)
  };
}; 