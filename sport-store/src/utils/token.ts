import { TOKEN_CONFIG } from '@/config/token';

export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
    if (!token) {
      return null;
    }

    // Kiểm tra token expiration
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
      
      if (Date.now() >= expirationTime) {
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