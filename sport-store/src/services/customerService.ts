import apiClient from "@/lib/api";
import { Customer } from "@/types/customer";

export const customerService = {
  // Lấy danh sách khách hàng
  getCustomers: async (page: number = 1, limit: number = 10) => {
    try {
      const response = await apiClient.get(`/admin/users?page=${page}&limit=${limit}`);
      return {
        success: true,
        message: "Lấy danh sách khách hàng thành công",
        data: {
          customers: response.data,
          total: response.data.length,
          page,
          limit,
          totalPages: Math.ceil(response.data.length / limit)
        }
      };
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết khách hàng
  getCustomerById: async (id: string) => {
    try {
      const response = await apiClient.get(`/admin/users/${id}`);
      return {
        success: true,
        message: "Lấy thông tin khách hàng thành công",
        data: response.data
      };
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  },

  // Tạo khách hàng mới
  createCustomer: async (customerData: Partial<Customer>) => {
    try {
      const response = await apiClient.post("/admin/users", customerData);
      return {
        success: true,
        message: "Tạo khách hàng thành công",
        data: response.data
      };
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  },

  // Cập nhật thông tin khách hàng
  updateCustomer: async (id: string, customerData: Partial<Customer>) => {
    try {
      const response = await apiClient.put(`/admin/users/${id}`, customerData);
      return {
        success: true,
        message: "Cập nhật thông tin khách hàng thành công",
        data: response.data
      };
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  },

  // Xóa khách hàng
  deleteCustomer: async (id: string) => {
    try {
      const response = await apiClient.delete(`/admin/users/${id}`);
      return {
        success: true,
        message: "Xóa khách hàng thành công",
        data: response.data
      };
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw error;
    }
  },

  // Xóa nhiều khách hàng
  deleteManyCustomers: async (ids: string[]) => {
    try {
      const response = await apiClient.delete("/admin/users/bulk", { data: { ids } });
      return {
        success: true,
        message: "Xóa nhiều khách hàng thành công",
        data: response.data
      };
    } catch (error) {
      console.error("Error deleting customers:", error);
      throw error;
    }
  },

  // Tìm kiếm khách hàng
  searchCustomers: async (query: string, page: number = 1, limit: number = 10) => {
    try {
      const response = await apiClient.get(`/admin/users/search?q=${query}&page=${page}&limit=${limit}`);
      return {
        success: true,
        message: "Tìm kiếm khách hàng thành công",
        data: {
          customers: response.data,
          total: response.data.length,
          page,
          limit,
          totalPages: Math.ceil(response.data.length / limit)
        }
      };
    } catch (error) {
      console.error("Error searching customers:", error);
      throw error;
    }
  }
}; 