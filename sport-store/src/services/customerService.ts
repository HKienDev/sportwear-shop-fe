import apiClient from "@/lib/api";
import { Customer } from "@/types/customer";

export const customerService = {
  // Lấy danh sách khách hàng
  getCustomers: async (page: number = 1, limit: number = 10) => {
    try {
      const response = await apiClient.get(`/admin/users?page=${page}&limit=${limit}`);
      
      // Xử lý dữ liệu để thêm thông tin về số đơn hàng đã giao
      const customersWithDeliveredOrders = response.data.map((customer: unknown) => {
        const customerObj = customer as Record<string, unknown>;
        // Nếu backend đã trả về deliveredOrders, sử dụng giá trị đó
        if (customerObj.deliveredOrders !== undefined) {
          return customer;
        }
        
        // Nếu có danh sách orders, tính toán từ danh sách đơn hàng
        if (customerObj.orders && Array.isArray(customerObj.orders)) {
          const deliveredOrders = (customerObj.orders as unknown[]).filter((order: unknown) => 
            (order as Record<string, unknown>).status === "delivered"
          ).length;
          
          return {
            ...(customer as object),
            deliveredOrders
          };
        }
        
        // Nếu không có danh sách orders nhưng có orderCount, sử dụng orderCount
        if (customerObj.orderCount !== undefined) {
          return {
            ...(customer as object),
            deliveredOrders: customerObj.orderCount
          };
        }
        
        // Nếu không có thông tin nào, mặc định là 0
        return {
          ...(customer as object),
          deliveredOrders: 0
        };
      });
      
      return {
        success: true,
        message: "Lấy danh sách khách hàng thành công",
        data: {
          customers: customersWithDeliveredOrders,
          total: customersWithDeliveredOrders.length,
          page,
          limit,
          totalPages: Math.ceil(customersWithDeliveredOrders.length / limit)
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
      
      // Tính toán số đơn hàng đã giao
      const customer = response.data;
      let deliveredOrders = 0;
      
      // Nếu có danh sách orders, tính toán từ danh sách đơn hàng
      if (customer.orders && Array.isArray(customer.orders)) {
        deliveredOrders = (customer.orders as unknown[]).filter((order: unknown) => 
          (order as Record<string, unknown>).status === "delivered"
        ).length;
      } 
      // Nếu không có danh sách orders nhưng có orderCount, sử dụng orderCount
      else if (customer.orderCount !== undefined) {
        deliveredOrders = customer.orderCount;
      }
      
      return {
        success: true,
        message: "Lấy thông tin khách hàng thành công",
        data: {
          ...customer,
          deliveredOrders
        }
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

  // Thay đổi mật khẩu khách hàng
  changePassword: async (id: string, newPassword: string) => {
    try {
      const response = await apiClient.put(`/admin/users/${id}/reset-password`, {
        userId: id,
        password: newPassword
      });
      return {
        success: true,
        message: "Thay đổi mật khẩu thành công",
        data: response.data
      };
    } catch (error) {
      console.error("Error changing password:", error);
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
      
      // Xử lý dữ liệu để thêm thông tin về số đơn hàng đã giao
      const customersWithDeliveredOrders = response.data.map((customer: unknown) => {
        const customerObj = customer as Record<string, unknown>;
        // Nếu backend đã trả về deliveredOrders, sử dụng giá trị đó
        if (customerObj.deliveredOrders !== undefined) {
          return customer;
        }
        
        // Nếu có danh sách orders, tính toán từ danh sách đơn hàng
        if (customerObj.orders && Array.isArray(customerObj.orders)) {
          const deliveredOrders = (customerObj.orders as unknown[]).filter((order: unknown) => 
            (order as Record<string, unknown>).status === "delivered"
          ).length;
          
          return {
            ...(customer as object),
            deliveredOrders
          };
        }
        
        // Nếu không có danh sách orders nhưng có orderCount, sử dụng orderCount
        if (customerObj.orderCount !== undefined) {
          return {
            ...(customer as object),
            deliveredOrders: customerObj.orderCount
          };
        }
        
        // Nếu không có thông tin nào, mặc định là 0
        return {
          ...(customer as object),
          deliveredOrders: 0
        };
      });
      
      return {
        success: true,
        message: "Tìm kiếm khách hàng thành công",
        data: {
          customers: customersWithDeliveredOrders,
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