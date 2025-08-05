import { apiClient } from '@/lib/apiClient';

export interface MessageStats {
  totalMessages: number;
  pendingMessages: number;
  repliedMessages: number;
  completedMessages: number;
  totalConversations: number;
  activeConversations: number;
  averageResponseTime: number;
}

export interface MessageStatsResponse {
  success: boolean;
  data: MessageStats;
  message: string;
}

class AdminMessageService {
  // Lấy thống kê tin nhắn cho admin
  async getMessageStats(): Promise<MessageStatsResponse> {
    try {
      const response = await apiClient.get('/api/chat/admin/stats');
      return response.data as MessageStatsResponse;
    } catch (error) {
      console.error('Error fetching message stats:', error);
      throw error;
    }
  }

  // Lấy danh sách conversations với stats
  async getConversationsWithStats(): Promise<{
    conversations: any[];
    stats: MessageStats;
  }> {
    try {
      const response = await apiClient.get('/api/chat/admin/conversations');
      return response.data as {
        conversations: any[];
        stats: MessageStats;
      };
    } catch (error) {
      console.error('Error fetching conversations with stats:', error);
      throw error;
    }
  }
}

export const adminMessageService = new AdminMessageService(); 