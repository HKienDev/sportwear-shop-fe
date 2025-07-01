import { api } from '@/lib/api';
import type { AxiosError } from 'axios';

function parseError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) return String((error as { message: unknown }).message);
  return 'Unknown error';
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError<unknown>;
    if (axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
      return String((axiosError.response.data as { message: unknown }).message);
    }
  }
  return parseError(error);
}

export interface CartItem {
  product: {
    sku: string;
    name: string;
    slug: string;
    brand: string;
    mainImage: string;
    salePrice: number;
  };
  quantity: number;
  color: string;
  size: string;
  totalPrice: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  _id: string;
}

export interface AddToCartRequest {
  sku: string;
  color: string;
  size: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  sku: string;
  color: string;
  size: string;
  quantity: number;
}

export interface RemoveFromCartRequest {
  sku: string;
  color: string;
  size: string;
}

export const cartService = {
  // Lấy giỏ hàng
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Error getting cart:', error);
      throw new Error(getErrorMessage(error));
    }
  },

  // Thêm vào giỏ hàng
  addToCart: async (data: AddToCartRequest) => {
    try {
      console.log('🛒 Bắt đầu thêm vào giỏ hàng:', data);
      
      if (!data.sku || !data.color || !data.size || !data.quantity) {
        console.log('❌ Dữ liệu không hợp lệ:', data);
        throw new Error('Thiếu thông tin sản phẩm');
      }

      console.log('📤 Gọi API thêm vào giỏ hàng');
      const response = await api.post('/cart/add', data);
      console.log('📥 Kết quả API:', response.data);
      
      if (!response.data) {
        console.log('❌ Response không hợp lệ');
        throw new Error('Không thể thêm sản phẩm vào giỏ hàng');
      }

      return response.data;
    } catch (error) {
      console.error('❌ Lỗi khi thêm vào giỏ hàng:', error);
      throw new Error(getErrorMessage(error));
    }
  },

  // Cập nhật số lượng
  updateCartItemQuantity: async (data: UpdateCartItemRequest) => {
    try {
      const response = await api.put('/cart/update', data);
      
      if (!response.data) {
        throw new Error('Invalid response from server');
      }

      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw new Error(getErrorMessage(error));
    }
  },

  // Xóa khỏi giỏ hàng
  removeFromCart: async (data: RemoveFromCartRequest) => {
    try {
      const response = await api.delete('/cart/remove', { data });
      
      if (!response.data) {
        throw new Error('Invalid response from server');
      }

      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw new Error(getErrorMessage(error));
    }
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async () => {
    try {
      const response = await api.delete('/cart/clear');
      
      if (!response.data) {
        throw new Error('Invalid response from server');
      }

      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new Error(getErrorMessage(error));
    }
  }
}; 