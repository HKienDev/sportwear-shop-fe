import axios from 'axios';
import { API_URL } from '@/utils/api';
import { TOKEN_CONFIG } from './token';

// Tạo instance axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  timeout: 30000 // 30 seconds
});

// Thêm interceptor để thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);

    if (token) {
      config.headers.Authorization = `${TOKEN_CONFIG.ACCESS_TOKEN.PREFIX} ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý lỗi
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
          withCredentials: true
        });

        if (response.data.success) {
          // Thử lại request ban đầu
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Nếu refresh token thất bại, chuyển hướng về trang đăng nhập
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    // Xử lý lỗi timeout
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout Error:', error);
      return Promise.reject(new Error('Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.'));
    }

    // Xử lý lỗi network
    if (error.message === 'Network Error') {
      console.error('Network Error:', error);
      return Promise.reject(new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng của bạn.'));
    }

    // Xử lý lỗi server
    if (error.response?.status >= 500) {
      console.error('Server Error:', error);
      return Promise.reject(new Error('Có lỗi xảy ra từ phía server. Vui lòng thử lại sau.'));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 