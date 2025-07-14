import { apiClient } from '@/lib/apiClient';
import type { Customer } from '@/types/customer';
import type { ApiResponse } from '@/types/api';

// Interface cho raw customer data từ API
interface RawCustomer {
  deliveredOrders?: number;
  orders?: unknown[];
  orderCount?: number;
  // Thống kê thực tế (bao gồm đơn hàng theo phone)
  realOrderCount?: number;
  realTotalSpent?: number;
  realDeliveredOrders?: number;
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
    console.log("🚀 customerService.getCustomers() called");
    const response = await apiClient.getUsers();
    console.log("📡 apiClient.getUsers() response:", response);
    // API trả về array trực tiếp, không bọc trong data
    const users = Array.isArray(response.data) ? response.data : [];
    console.log("👥 Raw users from API:", users.length, "users");
    
    // Tính toán thống kê thực tế cho từng customer
    const usersWithRealStats = await Promise.all(
      users.map(async (user: Record<string, unknown>) => {
        try {
          let allOrders: Record<string, unknown>[] = [];
          
          // Chỉ gọi API lấy đơn hàng cho users có role "user"
          if (user.role === 'user') {
            // Tìm theo userId
            try {
              console.log('🔍 Searching orders by userId for:', user._id);
              const ordersByUserIdResponse = await apiClient.get(`/orders?userId=${user._id}`);
              console.log('📡 ordersByUserIdResponse:', ordersByUserIdResponse);
              if (ordersByUserIdResponse.data && typeof ordersByUserIdResponse.data === 'object' && 'success' in ordersByUserIdResponse.data) {
                const responseData = ordersByUserIdResponse.data as { success: boolean; data?: unknown };
                console.log('📊 userId responseData:', responseData);
                if (responseData.success && responseData.data) {
                  const userIdOrders = Array.isArray(responseData.data) ? responseData.data : [];
                  allOrders = [...allOrders, ...userIdOrders];
                  console.log('📦 Orders found by userId for', user.phone, ':', userIdOrders.length);
                } else {
                  console.log('❌ ordersByUserIdResponse not successful or no data');
                }
              } else {
                console.log('❌ ordersByUserIdResponse.data is not valid');
              }
            } catch (error) {
              console.error(`❌ Error getting orders by userId for ${user.phone}:`, error);
            }
            
            // Tìm theo phone
            try {
              console.log('🔍 Searching orders by phone for:', user.phone);
              const ordersByPhoneResponse = await apiClient.getOrdersByPhone(user.phone as string);
              console.log('📡 ordersByPhoneResponse:', ordersByPhoneResponse);
              if (ordersByPhoneResponse.data && typeof ordersByPhoneResponse.data === 'object' && 'success' in ordersByPhoneResponse.data) {
                const responseData = ordersByPhoneResponse.data as { success: boolean; data?: unknown };
                console.log('📊 responseData:', responseData);
                if (responseData.success && responseData.data) {
                  const phoneOrders = Array.isArray(responseData.data) ? responseData.data : [];
                  console.log('📦 Orders found by phone for', user.phone, ':', phoneOrders.length);
                  
                  // Loại bỏ trùng lặp dựa trên _id
                  const existingIds = new Set(allOrders.map(order => (order._id as string)));
                  const uniquePhoneOrders = phoneOrders.filter(order => !existingIds.has(order._id as string));
                  allOrders = [...allOrders, ...uniquePhoneOrders];
                } else {
                  console.log('❌ ordersByPhoneResponse not successful or no data');
                }
              } else {
                console.log('❌ ordersByPhoneResponse.data is not valid');
              }
            } catch (error) {
              console.error(`❌ Error getting orders by phone for ${user.phone}:`, error);
            }
          } else {
            console.log('⏭️ Skipping orders lookup for non-user role:', user.role, 'phone:', user.phone);
          }
          
          // Tính toán thống kê từ tất cả đơn hàng
          const totalOrders = allOrders.length;
          const totalSpent = allOrders.reduce((total: number, order: Record<string, unknown>) => {
            return total + ((order.totalPrice as number) || 0);
          }, 0);
          const deliveredOrders = allOrders.filter((order: Record<string, unknown>) => 
            (order.status as string) === 'delivered'
          ).length;
          
          console.log('Total orders for', user.phone, ':', totalOrders, 'Total spent:', totalSpent);
          
          return {
            ...user,
            orderCount: totalOrders,
            totalSpent: totalSpent,
            deliveredOrders: deliveredOrders
          };
        } catch (error) {
          console.error(`Error getting orders for user ${user.phone}:`, error);
          return {
            ...user,
            orderCount: 0,
            totalSpent: 0,
            deliveredOrders: 0
          };
        }
      })
    );

    return {
      success: true,
      message: 'Lấy danh sách users thành công',
      data: {
        users: usersWithRealStats as Customer[],
        pagination: {
          total: usersWithRealStats.length,
          page: 1,
          limit: usersWithRealStats.length,
          totalPages: 1
        }
      }
    };
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
      const customersWithDeliveredOrders = await Promise.all(
        (response.data as unknown[]).map(async (customer: unknown) => {
          const rawCustomer = customer as RawCustomer;
          
          // Nếu backend đã trả về realOrderCount và realTotalSpent, sử dụng giá trị đó
          if (rawCustomer.realOrderCount !== undefined && rawCustomer.realTotalSpent !== undefined) {
            return customer;
          }
          
          // Nếu backend đã trả về deliveredOrders, sử dụng giá trị đó
          if (rawCustomer.deliveredOrders !== undefined) {
            return customer;
          }
          
          // Tính toán thống kê thực tế từ đơn hàng
          try {
            let allOrders: Record<string, unknown>[] = [];
            
            // Tìm theo userId
            try {
              const ordersByUserIdResponse = await apiClient.get(`/orders?userId=${rawCustomer._id}`);
              if (ordersByUserIdResponse.data && typeof ordersByUserIdResponse.data === 'object' && 'success' in ordersByUserIdResponse.data) {
                const responseData = ordersByUserIdResponse.data as { success: boolean; data?: unknown };
                if (responseData.success && responseData.data) {
                  const userIdOrders = Array.isArray(responseData.data) ? responseData.data : [];
                  allOrders = [...allOrders, ...userIdOrders];
                }
              }
            } catch (error) {
              console.error(`Error getting orders by userId for ${rawCustomer.phone}:`, error);
            }
            
            // Tìm theo phone
            try {
              const ordersByPhoneResponse = await apiClient.getOrdersByPhone(rawCustomer.phone as string);
              if (ordersByPhoneResponse.data && typeof ordersByPhoneResponse.data === 'object' && 'success' in ordersByPhoneResponse.data) {
                const responseData = ordersByPhoneResponse.data as { success: boolean; data?: unknown };
                if (responseData.success && responseData.data) {
                  const phoneOrders = Array.isArray(responseData.data) ? responseData.data : [];
                  
                  // Loại bỏ trùng lặp dựa trên _id
                  const existingIds = new Set(allOrders.map(order => (order._id as string)));
                  const uniquePhoneOrders = phoneOrders.filter(order => !existingIds.has(order._id as string));
                  allOrders = [...allOrders, ...uniquePhoneOrders];
                }
              }
            } catch (error) {
              console.error(`Error getting orders by phone for ${rawCustomer.phone}:`, error);
            }
            
            // Tính toán thống kê từ tất cả đơn hàng
            const totalOrders = allOrders.length;
            const totalSpent = allOrders.reduce((total: number, order: Record<string, unknown>) => {
              return total + ((order.totalPrice as number) || 0);
            }, 0);
            const deliveredOrders = allOrders.filter((order: Record<string, unknown>) => 
              (order.status as string) === 'delivered'
            ).length;

            return {
              ...(customer as Record<string, unknown>),
              orderCount: totalOrders,
              totalSpent: totalSpent,
              deliveredOrders: deliveredOrders
            };
          } catch (error) {
            console.error(`Error getting orders for user ${rawCustomer.phone}:`, error);
            return {
              ...(customer as Record<string, unknown>),
              orderCount: 0,
              totalSpent: 0,
              deliveredOrders: 0
            };
          }
        })
      );
      
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