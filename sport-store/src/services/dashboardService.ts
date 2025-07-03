import { apiClient } from '@/lib/apiClient';
import type { DashboardStats, RecentOrder, BestSellingProduct } from '@/types/dashboard';
import type { ApiResponse } from '@/types/api';

export const dashboardService = {
  // Get dashboard stats
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await apiClient.getDashboardStats();
    return response.data as ApiResponse<DashboardStats>;
  },

  // Get recent orders
  async getRecentOrders(): Promise<ApiResponse<RecentOrder[]>> {
    const response = await apiClient.getRecentOrders();
    return response.data as ApiResponse<RecentOrder[]>;
  },

  // Get best selling products
  async getBestSellingProducts(): Promise<ApiResponse<BestSellingProduct[]>> {
    const response = await apiClient.getBestSellingProducts();
    return response.data as ApiResponse<BestSellingProduct[]>;
  },

  // Get product stats
  async getProductStats(): Promise<ApiResponse<any>> {
    const response = await apiClient.getProductStats();
    return response.data as ApiResponse<any>;
  },

  // Get revenue stats
  async getRevenueStats(): Promise<ApiResponse<any>> {
    const response = await apiClient.getRevenueStats();
    return response.data as ApiResponse<any>;
  },

  // Lấy thống kê đơn hàng theo trạng thái
  getOrderStats: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.get("/admin/dashboard/orders");
      return {
        success: true,
        message: "Lấy thống kê đơn hàng thành công",
        data: response.data
      };
    } catch (error) {
      console.error("Error fetching order stats:", error);
      throw error;
    }
  },

  // Lấy thống kê sản phẩm bán chạy
  getTopProducts: async (limit: number = 5): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.get(`/admin/dashboard/top-products?limit=${limit}`);
      return {
        success: true,
        message: "Lấy thống kê sản phẩm bán chạy thành công",
        data: response.data
      };
    } catch (error) {
      console.error("Error fetching top products:", error);
      throw error;
    }
  },

  // Lấy thống kê khách hàng mới
  getNewCustomers: async (limit: number = 5): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.get(`/admin/dashboard/new-customers?limit=${limit}`);
      return {
        success: true,
        message: "Lấy thống kê khách hàng mới thành công",
        data: response.data
      };
    } catch (error) {
      console.error("Error fetching new customers:", error);
      throw error;
    }
  }
}; 