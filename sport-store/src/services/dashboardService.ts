import apiClient from "@/lib/api";

export const dashboardService = {
  // Lấy thống kê tổng quan
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get("/admin/dashboard/stats");
      return {
        success: true,
        message: "Lấy thống kê tổng quan thành công",
        data: response.data
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  // Lấy thống kê doanh thu theo thời gian
  getRevenueStats: async (period: "day" | "week" | "month" | "year") => {
    try {
      const response = await apiClient.get(`/admin/dashboard/revenue?period=${period}`);
      return {
        success: true,
        message: "Lấy thống kê doanh thu thành công",
        data: response.data
      };
    } catch (error) {
      console.error("Error fetching revenue stats:", error);
      throw error;
    }
  },

  // Lấy thống kê đơn hàng theo trạng thái
  getOrderStats: async () => {
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
  getTopProducts: async (limit: number = 5) => {
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
  getNewCustomers: async (limit: number = 5) => {
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