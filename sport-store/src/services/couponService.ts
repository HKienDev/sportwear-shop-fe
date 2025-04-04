import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/types/api';
import { Coupon } from '@/types/coupon';
import axios from 'axios';

export interface CreateCouponData {
    code?: string;
    type: '%' | 'VNĐ';
    value: number;
    usageLimit: number;
    userLimit: number;
    startDate: string;
    endDate: string;
    minimumPurchaseAmount: number;
}

export interface UpdateCouponData extends Partial<CreateCouponData> {
    _id: string;
}

export interface CouponQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    isActive?: boolean;
}

export const couponService = {
    // Lấy danh sách mã giảm giá
    getCoupons: async (params: CouponQueryParams = {}): Promise<ApiResponse<{ coupons: Coupon[]; total: number }>> => {
        try {
            const response = await apiClient.get('/coupons/admin', { params });
            return response.data;
        } catch (error) {
            console.error('Get coupons error:', error);
            throw error;
        }
    },

    // Lấy chi tiết mã giảm giá
    getCouponById: async (id: string): Promise<ApiResponse<Coupon>> => {
        try {
            if (!id) {
                throw new Error('ID mã giảm giá không hợp lệ');
            }
            
            const response = await apiClient.get(`/coupons/${id}`);
            
            if (!response.data) {
                throw new Error('Không nhận được dữ liệu từ server');
            }
            
            return response.data;
        } catch (error) {
            console.error('Get coupon error:', error);
            
            // Xử lý lỗi cụ thể
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
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

    // Tạo mã giảm giá mới
    createCoupon: async (data: CreateCouponData): Promise<ApiResponse<Coupon>> => {
        try {
            const response = await apiClient.post('/coupons/admin', data);
            return response.data;
        } catch (error) {
            console.error('Create coupon error:', error);
            throw error;
        }
    },

    // Cập nhật mã giảm giá
    updateCoupon: async (data: UpdateCouponData): Promise<ApiResponse<Coupon>> => {
        try {
            const response = await apiClient.put(`/coupons/admin/${data._id}`, data);
            return response.data;
        } catch (error) {
            console.error('Update coupon error:', error);
            throw error;
        }
    },

    // Xóa mã giảm giá
    deleteCoupon: async (id: string): Promise<ApiResponse<null>> => {
        try {
            const response = await apiClient.delete(`/coupons/admin/${id}`);
            return response.data;
        } catch (error) {
            console.error('Delete coupon error:', error);
            throw error;
        }
    },

    // Xóa nhiều mã giảm giá
    deleteManyCoupons: async (ids: string[]): Promise<ApiResponse<null>> => {
        try {
            const response = await apiClient.delete('/coupons/admin/bulk-delete', { data: { couponIds: ids } });
            return response.data;
        } catch (error) {
            console.error('Delete many coupons error:', error);
            throw error;
        }
    },
    
    // Tạm dừng mã giảm giá
    pauseCoupon: async (id: string): Promise<ApiResponse<Coupon>> => {
        try {
            const response = await apiClient.put(`/coupons/admin/${id}/pause`);
            return response.data;
        } catch (error) {
            console.error('Pause coupon error:', error);
            throw error;
        }
    },
    
    // Kích hoạt mã giảm giá
    activateCoupon: async (id: string): Promise<ApiResponse<Coupon>> => {
        try {
            const response = await apiClient.put(`/coupons/admin/${id}/activate`);
            return response.data;
        } catch (error) {
            console.error('Activate coupon error:', error);
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
    deleteManyCoupons,
    pauseCoupon,
    activateCoupon
} = couponService; 