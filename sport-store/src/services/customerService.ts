import { apiClient } from "@/lib/api";
import { Customer } from "@/types/customer";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface CustomerResponse {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const customerService = {
  // Lấy danh sách khách hàng
  getCustomers: async (page: number = 1, limit: number = 10) => {
    try {
      const response = await apiClient.get<ApiResponse<CustomerResponse>>(
        `/customers?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết khách hàng
  getCustomerById: async (id: string) => {
    try {
      const response = await apiClient.get<ApiResponse<Customer>>(
        `/customers/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  },

  // Tạo khách hàng mới
  createCustomer: async (customerData: Partial<Customer>) => {
    try {
      const response = await apiClient.post<ApiResponse<Customer>>(
        "/customers",
        customerData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  },

  // Cập nhật thông tin khách hàng
  updateCustomer: async (id: string, customerData: Partial<Customer>) => {
    try {
      const response = await apiClient.put<ApiResponse<Customer>>(
        `/customers/${id}`,
        customerData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  },

  // Xóa khách hàng
  deleteCustomer: async (id: string) => {
    try {
      const response = await apiClient.delete<ApiResponse<Customer>>(
        `/customers/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw error;
    }
  },

  // Xóa nhiều khách hàng
  deleteManyCustomers: async (ids: string[]) => {
    try {
      const response = await apiClient.delete<ApiResponse<Customer[]>>(
        "/customers/bulk",
        { data: { ids } }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting customers:", error);
      throw error;
    }
  },

  // Tìm kiếm khách hàng
  searchCustomers: async (query: string, page: number = 1, limit: number = 10) => {
    try {
      const response = await apiClient.get<ApiResponse<CustomerResponse>>(
        `/customers/search?q=${query}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error searching customers:", error);
      throw error;
    }
  },
}; 