import { apiClient } from '@/lib/apiClient';
import type { Customer } from '@/types/customer';
import type { ApiResponse } from '@/types/api';

// Interface cho raw customer data từ API
interface RawCustomer {
  deliveredOrders?: number;
  orders?: unknown[];
  orderCount?: number;
  [key: string]: unknown;
}

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
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data as ApiResponse<Customer>;
  },

  // Update customer
  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<ApiResponse<Customer>> {
    try {
      const response = await apiClient.put(`/admin/users/${id}`, customerData);
      return response.data as ApiResponse<Customer>;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  // Delete customer
  async deleteCustomer(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiClient.delete(`/admin/users/${id}`);
      return response.data as ApiResponse<{ message: string }>;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  // Change password
  async changePassword(id: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiClient.put(`/admin/users/${id}/reset-password`, { password: newPassword });
      return response.data as ApiResponse<{ message: string }>;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  // Toggle user status
  async toggleUserStatus(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.patch(`/admin/users/${id}/toggle-status`);
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
      await apiClient.delete("/admin/users/bulk", { data: { ids } });
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
      const customersWithDeliveredOrders = (response.data as unknown[]).map((customer: unknown) => {
        const rawCustomer = customer as RawCustomer;
        
        // Nếu backend đã trả về deliveredOrders, sử dụng giá trị đó
        if (rawCustomer.deliveredOrders !== undefined) {
          return customer;
        }
        
        // Nếu có danh sách orders, tính toán từ danh sách đơn hàng
        if (rawCustomer.orders && Array.isArray(rawCustomer.orders)) {
          const deliveredOrders = rawCustomer.orders.filter((order: unknown) => 
            (order as { status?: string })?.status === "delivered"
          ).length;
          
          return {
            ...(customer as Record<string, unknown>),
            deliveredOrders
          };
        }
        
        // Nếu không có danh sách orders nhưng có orderCount, sử dụng orderCount
        if (rawCustomer.orderCount !== undefined) {
          return {
            ...(customer as Record<string, unknown>),
            deliveredOrders: rawCustomer.orderCount
          };
        }
        
        // Nếu không có thông tin nào, mặc định là 0
        return {
          ...(customer as Record<string, unknown>),
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