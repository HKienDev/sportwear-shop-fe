import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/types/api';
import { Coupon } from '@/types/coupon';

export interface CreateCouponData {
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minPurchase: number;
    maxDiscount: number;
    startDate: string;
    endDate: string;
    usageLimit: number;
    isActive: boolean;
}

export interface UpdateCouponData extends Partial<CreateCouponData> {
    id: string;
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
            const response = await apiClient.get('/coupons', { params });
            return response.data;
        } catch (error) {
            console.error('Get coupons error:', error);
            throw error;
        }
    },

    // Lấy chi tiết mã giảm giá
    getCouponById: async (id: string): Promise<ApiResponse<Coupon>> => {
        try {
            const response = await apiClient.get(`/coupons/${id}`);
            return response.data;
        } catch (error) {
            console.error('Get coupon error:', error);
            throw error;
        }
    },

    // Tạo mã giảm giá mới
    createCoupon: async (data: CreateCouponData): Promise<ApiResponse<Coupon>> => {
        try {
            const response = await apiClient.post('/coupons', data);
            return response.data;
        } catch (error) {
            console.error('Create coupon error:', error);
            throw error;
        }
    },

    // Cập nhật mã giảm giá
    updateCoupon: async (data: UpdateCouponData): Promise<ApiResponse<Coupon>> => {
        try {
            const response = await apiClient.put(`/coupons/${data.id}`, data);
            return response.data;
        } catch (error) {
            console.error('Update coupon error:', error);
            throw error;
        }
    },

    // Xóa mã giảm giá
    deleteCoupon: async (id: string): Promise<ApiResponse<null>> => {
        try {
            const response = await apiClient.delete(`/coupons/${id}`);
            return response.data;
        } catch (error) {
            console.error('Delete coupon error:', error);
            throw error;
        }
    },

    // Xóa nhiều mã giảm giá
    deleteManyCoupons: async (ids: string[]): Promise<ApiResponse<null>> => {
        try {
            const response = await apiClient.delete('/coupons/bulk', { data: { ids } });
            return response.data;
        } catch (error) {
            console.error('Delete many coupons error:', error);
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
    deleteManyCoupons
} = couponService; 