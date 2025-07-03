import { apiClient } from '@/lib/apiClient';
import type { ApiResponse } from '@/types/api';
import type { Coupon } from '@/types/coupon';
import axios from 'axios';
import { TOKEN_CONFIG } from '@/config/token';

export interface CreateCouponData {
    type: 'percentage' | 'fixed';
    value: number;
    usageLimit: number;
    userLimit: number;
    startDate: string;
    endDate: string;
    minimumPurchaseAmount: number;
}

export interface UpdateCouponData {
    _id: string;
    type: "percentage" | "fixed";
    value: number;
    usageLimit: number;
    userLimit: number;
    minimumPurchaseAmount: number;
    startDate: string;
    endDate: string;
}

export interface CouponQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: 'percentage' | 'fixed';
    startDate?: string;
    endDate?: string;
    sort?: 'code' | 'createdAt' | 'updatedAt';
    order?: 'asc' | 'desc';
}

export interface BulkDeleteCouponsData {
    couponIds: string[];
}

export interface ApplyCouponData {
    code: string;
    amount: number;
}

export interface ValidateCouponData {
    code: string;
    amount: number;
}

export interface UseCouponData {
    code: string;
    orderId: string;
}

export const couponService = {
    // Get all coupons
    async getCoupons(search?: string, status?: string): Promise<ApiResponse<{ coupons: Coupon[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>> {
        const response = await apiClient.getCoupons(search, status);
        return response.data;
    },

    // Get coupon by ID
    async getCouponById(id: string): Promise<ApiResponse<Coupon>> {
        const response = await apiClient.get(`/api/coupons/${id}`);
        return response.data as ApiResponse<Coupon>;
    },

    // Create coupon
    async createCoupon(couponData: Partial<Coupon>): Promise<ApiResponse<Coupon>> {
        const response = await apiClient.createCoupon(couponData);
        return response.data as ApiResponse<Coupon>;
    },

    // Update coupon
    async updateCoupon(id: string, couponData: Partial<Coupon>): Promise<ApiResponse<Coupon>> {
        const response = await apiClient.updateCoupon(id, couponData);
        return response.data as ApiResponse<Coupon>;
    },

    // Delete coupon
    async deleteCoupon(id: string) {
        const response = await apiClient.deleteCoupon(id);
        return response.data;
    },

    // Xóa nhiều mã giảm giá
    bulkDeleteCoupons: async (data: BulkDeleteCouponsData): Promise<ApiResponse<null>> => {
        try {
            const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
            if (!token) {
                throw new Error('Vui lòng đăng nhập để tiếp tục');
            }

            apiClient.setAuthToken(token);

            const response = await apiClient.delete('/coupons/admin/bulk-delete', { data });
            return response.data as ApiResponse<null>;
        } catch (error) {
            console.error('Bulk delete coupons error:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                } else if (error.response?.status === 403) {
                    throw new Error('Bạn không có quyền truy cập tính năng này');
                } else if (error.response?.status === 400) {
                    throw new Error(error.response.data.message || 'Dữ liệu không hợp lệ');
                } else if (error.response?.status === 500) {
                    throw new Error('Lỗi server khi xóa mã giảm giá');
                } else if (error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
            }
            
            throw error;
        }
    },

    // Tạm dừng mã giảm giá
    pauseCoupon: async (id: string): Promise<ApiResponse<{ coupon: Coupon }>> => {
        try {
            const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
            if (!token) {
                throw new Error('Vui lòng đăng nhập để tiếp tục');
            }

            apiClient.setAuthToken(token);

            const response = await apiClient.put(`/coupons/admin/${id}/pause`);
            return response.data as ApiResponse<{ coupon: Coupon }>;
        } catch (error) {
            console.error('Pause coupon error:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                } else if (error.response?.status === 403) {
                    throw new Error('Bạn không có quyền truy cập tính năng này');
                } else if (error.response?.status === 404) {
                    throw new Error('Không tìm thấy mã giảm giá');
                } else if (error.response?.status === 500) {
                    throw new Error('Lỗi server khi tạm dừng mã giảm giá');
                } else if (error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
            }
            
            throw error;
        }
    },

    // Kích hoạt mã giảm giá
    activateCoupon: async (id: string): Promise<ApiResponse<{ coupon: Coupon }>> => {
        try {
            const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
            if (!token) {
                throw new Error('Vui lòng đăng nhập để tiếp tục');
            }

            apiClient.setAuthToken(token);

            const response = await apiClient.put(`/coupons/admin/${id}/activate`);
            return response.data as ApiResponse<{ coupon: Coupon }>;
        } catch (error) {
            console.error('Activate coupon error:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                } else if (error.response?.status === 403) {
                    throw new Error('Bạn không có quyền truy cập tính năng này');
                } else if (error.response?.status === 404) {
                    throw new Error('Không tìm thấy mã giảm giá');
                } else if (error.response?.status === 500) {
                    throw new Error('Lỗi server khi kích hoạt mã giảm giá');
                } else if (error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
            }
            
            throw error;
        }
    },

    // Áp dụng coupon
    applyCoupon: async (data: ApplyCouponData): Promise<ApiResponse<{ discount: number }>> => {
        try {
            const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
            if (!token) {
                throw new Error('Vui lòng đăng nhập để tiếp tục');
            }

            apiClient.setAuthToken(token);

            const response = await apiClient.post('/coupons/apply', data);
            return response.data as ApiResponse<{ discount: number }>;
        } catch (error) {
            console.error('Apply coupon error:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                } else if (error.response?.status === 400) {
                    throw new Error(error.response.data.message || 'Mã giảm giá không hợp lệ');
                } else if (error.response?.status === 404) {
                    throw new Error('Không tìm thấy mã giảm giá');
                } else if (error.response?.status === 500) {
                    throw new Error('Lỗi server khi áp dụng mã giảm giá');
                } else if (error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
            }
            
            throw error;
        }
    },

    // Lấy coupon theo mã
    getCouponByCode: async (code: string): Promise<ApiResponse<Coupon>> => {
        try {
            const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
            if (!token) {
                throw new Error('Vui lòng đăng nhập để tiếp tục');
            }

            apiClient.setAuthToken(token);

            const response = await apiClient.get(`/coupons/code/${code}`);
            return response.data as ApiResponse<Coupon>;
        } catch (error) {
            console.error('Get coupon by code error:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                } else if (error.response?.status === 404) {
                    throw new Error('Không tìm thấy mã giảm giá');
                } else if (error.response?.status === 500) {
                    throw new Error('Lỗi server khi lấy thông tin mã giảm giá');
                } else if (error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
            }
            
            throw error;
        }
    },

    // Kiểm tra mã coupon
    validateCoupon: async (data: ValidateCouponData): Promise<ApiResponse<{ isValid: boolean; message: string }>> => {
        try {
            const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
            if (!token) {
                throw new Error('Vui lòng đăng nhập để tiếp tục');
            }

            apiClient.setAuthToken(token);

            const response = await apiClient.post('/coupons/validate', data);
            return response.data as ApiResponse<{ isValid: boolean; message: string }>;
        } catch (error) {
            console.error('Validate coupon error:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                } else if (error.response?.status === 400) {
                    throw new Error(error.response.data.message || 'Mã giảm giá không hợp lệ');
                } else if (error.response?.status === 404) {
                    throw new Error('Không tìm thấy mã giảm giá');
                } else if (error.response?.status === 500) {
                    throw new Error('Lỗi server khi kiểm tra mã giảm giá');
                } else if (error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
            }
            
            throw error;
        }
    },

    // Sử dụng coupon
    useCoupon: async (data: UseCouponData): Promise<ApiResponse<null>> => {
        try {
            const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
            if (!token) {
                throw new Error('Vui lòng đăng nhập để tiếp tục');
            }

            apiClient.setAuthToken(token);

            const response = await apiClient.post('/coupons/use', data);
            return response.data as ApiResponse<null>;
        } catch (error) {
            console.error('Use coupon error:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                } else if (error.response?.status === 400) {
                    throw new Error(error.response.data.message || 'Không thể sử dụng mã giảm giá');
                } else if (error.response?.status === 404) {
                    throw new Error('Không tìm thấy mã giảm giá hoặc đơn hàng');
                } else if (error.response?.status === 500) {
                    throw new Error('Lỗi server khi sử dụng mã giảm giá');
                } else if (error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
            }
            
            throw error;
        }
    }
};

// Export các hàm riêng lẻ để dễ sử dụng
export const {
    getCoupons,
    getCouponById,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    bulkDeleteCoupons,
    pauseCoupon,
    activateCoupon,
    applyCoupon,
    getCouponByCode,
    validateCoupon,
    useCoupon
} = couponService; 