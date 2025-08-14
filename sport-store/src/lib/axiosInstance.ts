import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { TOKEN_CONFIG } from '@/config/token';
import { toast } from 'sonner';
import { handleAuthRedirect, shouldRedirectToLogin } from '@/utils/authRedirect';

// Interface mở rộng cho InternalAxiosRequestConfig để bao gồm _retry
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Tạo axios instance riêng biệt
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag để tránh multiple refresh requests
const isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Thêm interceptor để thêm token vào header
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);

    if (token) {
      config.headers.Authorization = `${TOKEN_CONFIG.ACCESS_TOKEN.PREFIX} ${token}`;
      
      // Đảm bảo cookie cũng được cập nhật
      const userData = localStorage.getItem(TOKEN_CONFIG.USER.STORAGE_KEY);
      if (userData) {
        try {
          const user = JSON.parse(userData);
          const userCookieValue = encodeURIComponent(JSON.stringify(user));
          document.cookie = `${TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME}=${token}; path=/; max-age=${TOKEN_CONFIG.ACCESS_TOKEN.EXPIRY / 1000}; SameSite=Lax`;
          document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${userCookieValue}; path=/; max-age=${TOKEN_CONFIG.REFRESH_TOKEN.EXPIRY / 1000}; SameSite=Lax`;
        } catch (error) {
          console.error('Error updating cookies in axios interceptor:', error);
        }
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý lỗi và auto refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
        
        if (refreshToken) {
          const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });
          
          if (response.data.success) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            
            localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, accessToken);
            localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY, newRefreshToken);
            
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }

      // Nếu refresh token thất bại, xử lý logout
      localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
      delete axiosInstance.defaults.headers.common['Authorization'];

      // Sử dụng logic thông minh thay vì redirect trực tiếp
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      if (shouldRedirectToLogin(currentPath)) {
        window.location.href = '/auth/login';
      } else {
        // Mở modal cho khách vãng lai
        handleAuthRedirect();
      }
    }

    return Promise.reject(error);
  }
); 