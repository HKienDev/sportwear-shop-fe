import { apiClient } from '@/lib/apiClient';
import { UserProduct } from '@/types/product';

export interface WishlistItem {
  _id: string;
  product: UserProduct;
  addedAt: string;
}

export interface WishlistResponse {
  success: boolean;
  message: string;
  data: {
    favorites: WishlistItem[];
    total: number;
  };
}

export interface WishlistActionResponse {
  success: boolean;
  message: string;
  data?: any;
}

class WishlistService {
  // Lấy danh sách wishlist
  async getWishlist(): Promise<WishlistResponse> {
    try {
      const response = await apiClient.get('/api/favorites');
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw new Error('Không thể lấy danh sách yêu thích');
    }
  }

  // Thêm sản phẩm vào wishlist
  async addToWishlist(productId: string): Promise<WishlistActionResponse> {
    try {
      const response = await apiClient.post('/api/favorites/add', { productId });
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw new Error('Không thể thêm sản phẩm vào danh sách yêu thích');
    }
  }

  // Xóa sản phẩm khỏi wishlist
  async removeFromWishlist(productId: string): Promise<WishlistActionResponse> {
    try {
      const response = await apiClient.post('/api/favorites/remove', { productId });
      return response.data;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw new Error('Không thể xóa sản phẩm khỏi danh sách yêu thích');
    }
  }

  // Kiểm tra sản phẩm có trong wishlist không
  async checkWishlistStatus(productId: string): Promise<boolean> {
    try {
      const response = await this.getWishlist();
      return response.data.favorites.some(item => item.product._id === productId);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  }

  // Xóa toàn bộ wishlist
  async clearWishlist(): Promise<WishlistActionResponse> {
    try {
      const wishlist = await this.getWishlist();
      const promises = wishlist.data.favorites.map(item => 
        this.removeFromWishlist(item.product._id)
      );
      await Promise.all(promises);
      return { success: true, message: 'Đã xóa toàn bộ danh sách yêu thích' };
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw new Error('Không thể xóa toàn bộ danh sách yêu thích');
    }
  }
}

export const wishlistService = new WishlistService();
