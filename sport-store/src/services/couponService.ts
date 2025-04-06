import apiClient from '@/lib/api';
import { ApiResponse } from '@/types/api';
import { Coupon } from '@/types/coupon';
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

export const couponService = {
    // Lấy danh sách mã giảm giá
    getCoupons: async (params: CouponQueryParams = {}): Promise<ApiResponse<{ coupons: Coupon[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>> => {
        try {
            // Kiểm tra token
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vui lòng đăng nhập để tiếp tục');
            }

            // Set token vào header
            apiClient.setAuthToken(token);

            // Chuyển đổi tham số để đồng bộ với BE
            const queryParams = {
                page: params.page || 1,
                limit: params.limit || 10,
                search: params.search || '',
                status: params.status,
                type: params.type,
                startDate: params.startDate,
                endDate: params.endDate,
                sort: params.sort,
                order: params.order
            };

            console.log('Coupon query params:', queryParams);
            console.log('Status value:', queryParams.status, 'Type:', typeof queryParams.status);

            const response = await apiClient.get('/coupons/admin', { params: queryParams });
            return response.data;
        } catch (error) {
            console.error('Get coupons error:', error);
            
            // Xử lý lỗi cụ thể
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                } else if (error.response?.status === 403) {
                    throw new Error('Bạn không có quyền truy cập tính năng này');
                } else if (error.response?.status === 500) {
                    throw new Error('Lỗi server khi lấy danh sách mã giảm giá');
                } else if (error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
            }
            
            throw error;
        }
    },

    // Lấy thông tin mã giảm giá theo ID
    getCouponById: async (id: string): Promise<ApiResponse<Coupon>> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vui lòng đăng nhập để tiếp tục');
            }

            apiClient.setAuthToken(token);

            const response = await apiClient.get(`/coupons/admin/${id}`);
            return response.data;
        } catch (error) {
            console.error('Get coupon by id error:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                } else if (error.response?.status === 403) {
                    throw new Error('Bạn không có quyền truy cập tính năng này');
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

    // Tạo mã giảm giá mới
    createCoupon: async (data: CreateCouponData): Promise<ApiResponse<Coupon>> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vui lòng đăng nhập để tiếp tục');
            }

            apiClient.setAuthToken(token);

            const response = await apiClient.post('/coupons/admin', data);
            console.log('API response in createCoupon:', response);
            
            // API trả về Coupon trực tiếp, không cần wrapper { coupon: Coupon }
            return response.data;
        } catch (error) {
            console.error('Create coupon error:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                } else if (error.response?.status === 403) {
                    throw new Error('Bạn không có quyền truy cập tính năng này');
                } else if (error.response?.status === 400) {
                    throw new Error(error.response.data.message || 'Dữ liệu không hợp lệ');
                } else if (error.response?.status === 500) {
                    throw new Error('Lỗi server khi tạo mã giảm giá');
                } else if (error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
            }
            
            throw error;
        }
    },

    // Cập nhật mã giảm giá
    updateCoupon: async (data: UpdateCouponData): Promise<ApiResponse<Coupon>> => {
        try {
            const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
            if (!token) {
                throw new Error('Vui lòng đăng nhập để tiếp tục');
            }

            apiClient.setAuthToken(token);

            const { _id, ...updateData } = data;
            console.log('Sending update request with data:', updateData);
            const response = await apiClient.put(`/coupons/admin/${_id}`, updateData);
            console.log('Update response:', response.data);

            // Kiểm tra và xử lý response
            if (!response.data) {
                throw new Error('Không nhận được dữ liệu từ server');
            }

            // Đảm bảo response.data có cấu trúc đúng
            const responseData: ApiResponse<Coupon> = {
                success: response.data.success || false,
                message: response.data.message || '',
                data: response.data.data || null
            };

            return responseData;
        } catch (error) {
            console.error('Update coupon error:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                } else if (error.response?.status === 403) {
                    throw new Error('Bạn không có quyền truy cập tính năng này');
                } else if (error.response?.status === 400) {
                    throw new Error(error.response.data.message || 'Dữ liệu không hợp lệ');
                } else if (error.response?.status === 404) {
                    throw new Error('Không tìm thấy mã giảm giá');
                } else if (error.response?.status === 500) {
                    throw new Error('Lỗi server khi cập nhật mã giảm giá');
                } else if (error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
            }
            
            throw error;
        }
    },

    // Xóa mã giảm giá
    deleteCoupon: async (id: string): Promise<ApiResponse<null>> => {
        try {
            const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
            if (!token) {
                throw new Error('Vui lòng đăng nhập để tiếp tục');
            }

            apiClient.setAuthToken(token);

            const response = await apiClient.delete(`/coupons/admin/${id}`);
            return response.data;
        } catch (error) {
            console.error('Delete coupon error:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
                } else if (error.response?.status === 403) {
                    throw new Error('Bạn không có quyền truy cập tính năng này');
                } else if (error.response?.status === 404) {
                    throw new Error('Không tìm thấy mã giảm giá');
                } else if (error.response?.status === 500) {
                    throw new Error('Lỗi server khi xóa mã giảm giá');
                } else if (error.response?.data?.message) {
                    throw new Error(error.response.data.message);
                }
            }
            
            throw error;
        }
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
            return response.data;
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
            return response.data;
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
            return response.data;
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
    activateCoupon
} = couponService; 