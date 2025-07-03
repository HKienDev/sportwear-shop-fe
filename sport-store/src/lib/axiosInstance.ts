import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { TOKEN_CONFIG } from '@/config/token';
import { toast } from 'sonner';

// Tạo axios instance riêng biệt
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag để tránh multiple refresh requests
let isRefreshing = false;
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
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý lỗi và auto refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Nếu lỗi 401 và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, thêm request vào queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `${TOKEN_CONFIG.ACCESS_TOKEN.PREFIX} ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API refresh token
        const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/auth/refresh-token`, {
          refreshToken
        }, {
          withCredentials: true
        });

        if (response.data.success) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          // Lưu tokens mới
          localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, accessToken);
          localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY, newRefreshToken);
          
          // Cập nhật header cho request hiện tại
          originalRequest.headers.Authorization = `${TOKEN_CONFIG.ACCESS_TOKEN.PREFIX} ${accessToken}`;
          
          // Process queue
          processQueue(null, accessToken);
          
          // Thử lại request ban đầu
          return axiosInstance(originalRequest);
        } else {
          throw new Error('Refresh token failed');
        }
      } catch (refreshError) {
        // Nếu refresh token thất bại, logout user
        processQueue(refreshError, null);
        
        // Clear tokens
        localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
        localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
        localStorage.removeItem(TOKEN_CONFIG.USER.STORAGE_KEY);
        
        // Clear cookies
        document.cookie = `${TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
        document.cookie = `${TOKEN_CONFIG.REFRESH_TOKEN.COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
        document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
        
        // Show notification
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        
        // Redirect to login page
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 1000);
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Xử lý lỗi timeout
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout Error:', error);
      toast.error('Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.');
      return Promise.reject(new Error('Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.'));
    }

    // Xử lý lỗi network
    if (error.message === 'Network Error') {
      console.error('Network Error:', error);
      toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng của bạn.');
      return Promise.reject(new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng của bạn.'));
    }

    // Xử lý lỗi server
    if (error.response?.status && error.response.status >= 500) {
      console.error('Server Error:', error);
      toast.error('Có lỗi xảy ra từ phía server. Vui lòng thử lại sau.');
      return Promise.reject(new Error('Có lỗi xảy ra từ phía server. Vui lòng thử lại sau.'));
    }

    // Xử lý lỗi 403 (Forbidden)
    if (error.response?.status === 403) {
      toast.error('Bạn không có quyền truy cập vào tài nguyên này.');
      return Promise.reject(new Error('Bạn không có quyền truy cập vào tài nguyên này.'));
    }

    // Xử lý lỗi 404 (Not Found)
    if (error.response?.status === 404) {
      toast.error('Tài nguyên không tồn tại.');
      return Promise.reject(new Error('Tài nguyên không tồn tại.'));
    }

    return Promise.reject(error);
  }
); 