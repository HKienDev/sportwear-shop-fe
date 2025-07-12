import { apiClient } from '@/lib/apiClient';
import type { Order, CreateOrderInput } from '@/types/order';
import type { ApiResponse } from '@/types/api';
import { API_URL } from '@/utils/api';

/**
 * Xóa một đơn hàng theo ID
 * @param orderId ID của đơn hàng cần xóa
 * @returns Promise với kết quả xóa đơn hàng
 */
export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete order');
    }

    return;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

/**
 * Xóa nhiều đơn hàng cùng lúc
 * @param orderIds Mảng các ID đơn hàng cần xóa
 * @returns Promise với kết quả xóa đơn hàng
 */
export const bulkDeleteOrders = async (orderIds: string[]): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/orders/bulk-delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ orderIds }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete orders');
    }

    return;
  } catch (error) {
    console.error('Error deleting orders:', error);
    throw error;
  }
};

export const orderService = {
  // Get all orders
  async getOrders(): Promise<ApiResponse<Order[]>> {
    const response = await apiClient.getOrders();
    return response.data as ApiResponse<Order[]>;
  },

  // Get order by ID
  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    const response = await apiClient.getOrderById(id);
    return response.data as ApiResponse<Order>;
  },

  // Create order
  async createOrder(orderData: unknown): Promise<ApiResponse<Order>> {
    const response = await apiClient.createOrder(orderData as any);
    return response.data as ApiResponse<Order>;
  },

  // Update order status
  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<Order>> {
    const response = await apiClient.updateOrderStatus(id, status);
    return response.data as ApiResponse<Order>;
  },

  // Get orders by phone
  async getOrdersByPhone(phone: string): Promise<ApiResponse<Order[]>> {
    const response = await apiClient.getOrdersByPhone(phone);
    return response.data as ApiResponse<Order[]>;
  }
}; 