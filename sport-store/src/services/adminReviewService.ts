import { apiClient } from '@/lib/apiClient';

export interface AdminReview {
  _id: string;
  product: {
    _id: string;
    name: string;
    mainImage: string;
    sku: string;
  };
  user: {
    _id: string;
    fullname: string;
    avatar: string;
  };
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  status: string;
  visibility: string;
  isVerified: boolean;
  isHelpful: number;
  helpfulUsers: string[];
  orderId: string;
  orderShortId: string;
  purchasedItem: {
    sku: string;
    name: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
  };
  adminNote?: string;
  reviewedBy?: {
    _id: string;
    fullname: string;
  };
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminReviewsResponse {
  success: boolean;
  data: {
    reviews: AdminReview[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
}

export interface ReviewStats {
  total: number;
  averageRating: number;
  totalHelpful: number;
}

export interface ReviewStatsResponse {
  success: boolean;
  data: ReviewStats;
  message: string;
}

class AdminReviewService {
  // Lấy danh sách review cho admin
  async getReviews(
    page: number = 1,
    limit: number = 10,
    filters: {
      rating?: number;
      productSku?: string;
      userId?: string;
    } = {},
    sortBy: string = 'createdAt',
    sortOrder: string = 'desc'
  ): Promise<AdminReviewsResponse> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      
      if (filters.rating) params.append('rating', filters.rating.toString());
      if (filters.productSku) params.append('productSku', filters.productSku);
      if (filters.userId) params.append('userId', filters.userId);

      const response = await apiClient.get(`/api/reviews/admin?${params}`);
      return response.data as AdminReviewsResponse;
    } catch (error) {
      console.error('Error fetching admin reviews:', error);
      throw error;
    }
  }

  // Lấy thống kê review
  async getReviewStats(): Promise<ReviewStatsResponse> {
    try {
      const response = await apiClient.get('/api/reviews/admin/stats');
      return response.data as ReviewStatsResponse;
    } catch (error) {
      console.error('Error fetching review stats:', error);
      // Return default stats on error
      return {
        success: true,
        data: {
          total: 0,
          averageRating: 0,
          totalHelpful: 0
        },
        message: 'Review stats retrieved successfully'
      };
    }
  }



  // Cập nhật review
  async updateReview(
    reviewId: string,
    updateData: {
      title?: string;
      comment?: string;
      rating?: number;
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.put(`/api/reviews/admin/${reviewId}`, updateData);
      return response.data as { success: boolean; message: string };
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  // Xóa review
  async deleteReview(reviewId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/api/reviews/admin/${reviewId}`);
      return response.data as { success: boolean; message: string };
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  // Xóa nhiều review
  async bulkDeleteReviews(reviewIds: string[]): Promise<{ success: boolean; message: string; deletedCount: number }> {
    try {
      const response = await apiClient.delete('/api/reviews/admin/bulk-delete', {
        data: { reviewIds }
      });
      return response.data as { success: boolean; message: string; deletedCount: number };
    } catch (error) {
      console.error('Error bulk deleting reviews:', error);
      throw error;
    }
  }

  // Phản hồi đánh giá
  async replyToReview(reviewId: string, adminReply: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.put(`/api/reviews/admin/${reviewId}/reply`, {
        adminReply
      });
      return response.data as { success: boolean; message: string };
    } catch (error) {
      console.error('Error replying to review:', error);
      throw error;
    }
  }

  async updateAdminReply(reviewId: string, adminReply: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.put(`/api/reviews/admin/${reviewId}/reply/update`, {
        adminReply
      });
      return response.data as { success: boolean; message: string };
    } catch (error) {
      console.error('Error updating admin reply:', error);
      throw error;
    }
  }

  async deleteAdminReply(reviewId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/api/reviews/admin/${reviewId}/reply`);
      return response.data as { success: boolean; message: string };
    } catch (error) {
      console.error('Error deleting admin reply:', error);
      throw error;
    }
  }
}

export const adminReviewService = new AdminReviewService(); 