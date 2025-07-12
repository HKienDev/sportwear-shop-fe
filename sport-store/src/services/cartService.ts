import { apiClient } from '@/lib/apiClient';
import type { Cart } from '@/types/cart';
import type { ApiResponse } from '@/types/api';

export const cartService = {
  // Get cart
  async getCart(): Promise<ApiResponse<Cart>> {
    const response = await apiClient.getCart();
    return response.data as ApiResponse<Cart>;
  },

  // Add to cart
  async addToCart(productData: { sku: string; color?: string; size?: string; quantity?: number }): Promise<ApiResponse<Cart>> {
    const response = await apiClient.addToCart(productData);
    return response.data as ApiResponse<Cart>;
  },

  // Update cart item
  async updateCart(productData: { sku: string; color?: string; size?: string; quantity?: number }): Promise<ApiResponse<Cart>> {
    const response = await apiClient.updateCart(productData);
    return response.data as ApiResponse<Cart>;
  },

  // Remove from cart
  async removeFromCart(productData: { sku: string; color?: string; size?: string }): Promise<ApiResponse<Cart>> {
    const response = await apiClient.removeFromCart(productData);
    return response.data as ApiResponse<Cart>;
  },

  // Clear cart
  async clearCart(): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.clearCart();
    return response.data as ApiResponse<{ message: string }>;
  },

  // Update cart item quantity (alias for updateCart)
  async updateCartItemQuantity({ sku, color, size, quantity }: { sku: string; color?: string; size?: string; quantity: number }): Promise<ApiResponse<Cart>> {
    return this.updateCart({ sku, color, size, quantity });
  }
}; 