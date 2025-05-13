import { fetchApi } from './api';
import { isAdmin as checkAdmin } from './roleUtils';
import { TOKEN_CONFIG } from '@/config/token';
import { API_URL } from "@/utils/api";

export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
    if (!token) {
      console.log('❌ Không tìm thấy token trong localStorage');
      return null;
    }

    // Kiểm tra token expiration
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
      
      if (Date.now() >= expirationTime) {
        console.log('❌ Token đã hết hạn');
        localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
        return null;
      }
    } catch (error) {
      console.error('❌ Lỗi khi parse token:', error);
      localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      return null;
    }

    return token;
  } catch (error) {
    console.error('❌ Lỗi khi lấy token:', error);
    return null;
  }
};

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetchApi('/auth/verify-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Không thể verify token');
    }

    return true;
  } catch (error) {
    console.error('❌ Lỗi khi verify token:', error);
    return false;
  }
};

export const setAuthToken = (token: string) => {
  try {
    // Lưu vào localStorage
    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, token);
    
    // Lưu vào cookie với httpOnly để bảo mật hơn
    document.cookie = `${TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME}=${token}; path=/`;
    
    console.log('✅ Token đã được lưu thành công');
  } catch (error) {
    console.error('❌ Lỗi khi lưu token:', error);
  }
};

export const removeAuthToken = () => {
  try {
    // Xóa khỏi localStorage
    localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
    
    // Xóa khỏi cookie
    document.cookie = `${TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    
    console.log('✅ Token đã được xóa thành công');
  } catch (error) {
    console.error('❌ Lỗi khi xóa token:', error);
  }
};

export const isAuthenticated = async () => {
  const token = await getAuthToken();
  if (!token) return false;

  return await verifyToken(token);
};

export const getUserRole = () => {
  try {
    const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
    if (!token) return null;

    const tokenData = JSON.parse(atob(token.split('.')[1]));
    return tokenData.role;
  } catch (error) {
    console.error('❌ Lỗi khi lấy user role:', error);
    return null;
  }
};

export const isAdmin = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user) return false;
    const userData = JSON.parse(user);
    return checkAdmin(userData);
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra admin:', error);
    return false;
  }
};

export const refreshToken = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Không thể refresh token');
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      return data.token;
    }

    throw new Error('Không nhận được token mới');
  } catch (error) {
    console.error('❌ Lỗi refresh token:', error);
    throw error;
  }
};