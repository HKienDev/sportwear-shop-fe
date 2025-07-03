import { apiClient } from '@/lib/apiClient';
import type { Customer } from '@/types/customer';
import type { ApiResponse } from '@/types/api';

export const customerService = {
  // Get all customers
  async getCustomers(): Promise<ApiResponse<{
    users: Customer[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>> {
    const response = await apiClient.getUsers();
    return response.data as ApiResponse<{
      users: Customer[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>;
  },

  // Get customer by ID
  async getCustomerById(id: string): Promise<ApiResponse<Customer>> {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data as ApiResponse<Customer>;
  },

  // Update customer
  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<ApiResponse<Customer>> {
    const response = await apiClient.put(`/api/users/${id}`, customerData);
    return response.data as ApiResponse<Customer>;
  },

  // Delete customer
  async deleteCustomer(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data as ApiResponse<{ message: string }>;
  },

  // Change password
  async changePassword(id: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.put(`/api/users/${id}/password`, { newPassword });
    return response.data as ApiResponse<{ message: string }>;
  },

  // Tạo khách hàng mới
  createCustomer: async (customerData: Partial<Customer>): Promise<ApiResponse<Customer>> => {
    try {
      const response = await apiClient.post("/admin/users", customerData);
      return {
        success: true,
        message: "Tạo khách hàng thành công",
        data: response.data as Customer
      };
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  },

  // Xóa nhiều khách hàng
  deleteManyCustomers: async (ids: string[]): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await apiClient.delete("/admin/users/bulk", { data: { ids } });
      return {
        success: true,
        message: "Xóa nhiều khách hàng thành công",
        data: { message: "Xóa nhiều khách hàng thành công" }
      };
    } catch (error) {
      console.error("Error deleting customers:", error);
      throw error;
    }
  },

  // Tìm kiếm khách hàng
  searchCustomers: async (query: string, page: number = 1, limit: number = 10): Promise<ApiResponse<{
    customers: Customer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>> => {
    try {
      const response = await apiClient.get(`/admin/users/search?q=${query}&page=${page}&limit=${limit}`);
      
      // Xử lý dữ liệu để thêm thông tin về số đơn hàng đã giao
      const customersWithDeliveredOrders = (response.data as any[]).map((customer: any) => {
        // Nếu backend đã trả về deliveredOrders, sử dụng giá trị đó
        if (customer.deliveredOrders !== undefined) {
          return customer;
        }
        
        // Nếu có danh sách orders, tính toán từ danh sách đơn hàng
        if (customer.orders && Array.isArray(customer.orders)) {
          const deliveredOrders = customer.orders.filter((order: any) => 
            order.status === "delivered"
          ).length;
          
          return {
            ...customer,
            deliveredOrders
          };
        }
        
        // Nếu không có danh sách orders nhưng có orderCount, sử dụng orderCount
        if (customer.orderCount !== undefined) {
          return {
            ...customer,
            deliveredOrders: customer.orderCount
          };
        }
        
        // Nếu không có thông tin nào, mặc định là 0
        return {
          ...customer,
          deliveredOrders: 0
        };
      });
      
      return {
        success: true,
        message: "Tìm kiếm khách hàng thành công",
        data: {
          customers: customersWithDeliveredOrders as Customer[],
          total: customersWithDeliveredOrders.length,
          page,
          limit,
          totalPages: Math.ceil(customersWithDeliveredOrders.length / limit)
        }
      };
    } catch (error) {
      console.error("Error searching customers:", error);
      throw error;
    }
  }
}; 