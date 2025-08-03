import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { TOKEN_CONFIG } from '@/config/token';

// Biến để theo dõi trạng thái refresh token
let isRefreshing = false;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3;
const REFRESH_COOLDOWN = 60000; // 1 phút
let lastRefreshTime = 0;

// Queue để lưu các request đang chờ khi refresh token
const failedQueue: Array<{ resolve: (value: any) => void; reject: (error: any) => void }> = [];

// Hàm xử lý lỗi auth
const handleAuthError = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
        localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
        localStorage.removeItem(TOKEN_CONFIG.USER.STORAGE_KEY);
        window.location.href = '/auth/login';
    }
};

// Kiểm tra xem có thể refresh token không
const canRefresh = () => {
    const now = Date.now();
    if (now - lastRefreshTime < REFRESH_COOLDOWN) {
        return false;
    }
    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        return false;
    }
    return true;
};

// Reset số lần thử refresh
const resetRefreshAttempts = () => {
    refreshAttempts = 0;
    lastRefreshTime = Date.now();
};

// Tạo axios instance với cấu hình tối ưu
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor để tự động thêm token vào header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY) : null;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý refresh token
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        // Log lỗi chi tiết
        console.error('API Error:', {
            config: error.config,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        // Xử lý lỗi network
        if (error.message === 'Network Error') {
            console.error('Network Error - Kiểm tra kết nối mạng hoặc server');
            return Promise.reject(new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.'));
        }

        // Xử lý timeout
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
            return Promise.reject(new Error('Yêu cầu quá thời gian. Vui lòng thử lại.'));
        }

        const originalRequest = error.config as CustomAxiosRequestConfig | undefined;
        
        // Kiểm tra nếu lỗi 401 và chưa thử refresh
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                });
            }
            
            originalRequest._retry = true;
            isRefreshing = true;
            
            try {
                // Kiểm tra xem có thể refresh không
                const canRefreshResult = canRefresh();
                
                if (!canRefreshResult) {
                    handleAuthError();
                    return Promise.reject(error);
                }
                
                refreshAttempts++;
                
                // Lấy refresh token từ localStorage
                const refreshToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY) : null;
                
                if (!refreshToken) {
                    handleAuthError();
                    return Promise.reject(error);
                }
                
                // Gọi API refresh token
                const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });
                
                if (response.data.success && response.data.data) {
                    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                    
                    // Cập nhật token trong localStorage
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, accessToken);
                        localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY, newRefreshToken);
                    }
                    
                    // Reset số lần thử refresh
                    resetRefreshAttempts();
                    
                    // Cập nhật header cho request gốc
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    
                    // Xử lý các request trong queue
                    failedQueue.forEach(({ resolve }) => {
                        resolve(axiosInstance(originalRequest));
                    });
                    failedQueue.length = 0;
                    
                    // Thực hiện lại request gốc
                    return axiosInstance(originalRequest);
                } else {
                    handleAuthError();
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                // Xử lý lỗi refresh token
                failedQueue.forEach(({ reject }) => {
                    reject(refreshError);
                });
                failedQueue.length = 0;
                
                handleAuthError();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        
        return Promise.reject(error);
    }
);

// Interface cho axios instance với method setAuthToken
interface CustomAxiosInstance extends AxiosInstance {
    setAuthToken: (token: string | null) => void;
}

// Interface cho request config với _retry flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Tạo API client với method setAuthToken
const api = axiosInstance as CustomAxiosInstance;

// Thêm method setAuthToken
api.setAuthToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common.Authorization;
    }
};

// Export các method API cơ bản
export const apiClient = {
    get: <T = any>(url: string, config?: any) => api.get<T>(url, config),
    post: <T = any>(url: string, data?: any, config?: any) => api.post<T>(url, data, config),
    put: <T = any>(url: string, data?: any, config?: any) => api.put<T>(url, data, config),
    patch: <T = any>(url: string, data?: any, config?: any) => api.patch<T>(url, data, config),
    delete: <T = any>(url: string, config?: any) => api.delete<T>(url, config),
    setAuthToken: api.setAuthToken,
};

// Export axios instance và api client
export { api, axiosInstance };
export default apiClient;