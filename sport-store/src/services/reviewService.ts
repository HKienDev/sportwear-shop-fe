import { apiClient } from '@/lib/apiClient';

export interface Review {
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
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isVerified: boolean;
  isHelpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  productSku: string;
  orderId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: Review[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
}

export interface CreateReviewResponse {
  success: boolean;
  data: {
    review: Review;
  };
  message: string;
}

class ReviewService {
  // Lấy danh sách reviews cho sản phẩm
  async getProductReviews(
    productSku: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: string = 'desc'
  ): Promise<ReviewsResponse> {
    try {
      const params = new URLSearchParams({
        productSku,
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      const response = await apiClient.get(`/api/reviews?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw error;
    }
  }

  // Tạo review mới
  async createReview(reviewData: CreateReviewData): Promise<CreateReviewResponse> {
    try {
      const response = await apiClient.post('/api/reviews/create', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  // Lấy reviews của user
  async getUserReviews(
    page: number = 1,
    limit: number = 10
  ): Promise<ReviewsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      const response = await apiClient.get(`/api/reviews?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  }

  // Cập nhật review
  async updateReview(
    reviewId: string,
    updateData: Partial<CreateReviewData>
  ): Promise<CreateReviewResponse> {
    try {
      const response = await apiClient.put(`/reviews/${reviewId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  // Xóa review
  async deleteReview(reviewId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/api/reviews/delete/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  // Đánh giá review hữu ích
  async toggleHelpful(reviewId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post(`/reviews/${reviewId}/helpful`);
      return response.data;
    } catch (error) {
      console.error('Error toggling helpful:', error);
      throw error;
    }
  }
}

export const reviewService = new ReviewService(); 