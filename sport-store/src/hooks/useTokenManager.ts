import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/authContext';
import { TOKEN_CONFIG } from '@/config/token';
import { toast } from 'sonner';

interface TokenManagerOptions {
  refreshThreshold?: number; // Thời gian (ms) trước khi token hết hạn để refresh
  checkInterval?: number; // Thời gian (ms) giữa các lần kiểm tra
  enableAutoRefresh?: boolean; // Bật/tắt auto refresh
}

export const useTokenManager = (options: TokenManagerOptions = {}) => {
  const {
    refreshThreshold = 5 * 60 * 1000, // 5 phút
    checkInterval = 60 * 1000, // 1 phút
    enableAutoRefresh = true
  } = options;

  const { logout, checkAuthStatus } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isCheckingRef = useRef(false);

  // Kiểm tra token expiration
  const checkTokenExpiration = useCallback(async () => {
    if (isCheckingRef.current) return;
    
    try {
      isCheckingRef.current = true;
      
      const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
      
      if (!accessToken || !refreshToken) {
        return;
      }

      // Decode JWT để lấy expiration time
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;

        // Nếu token sắp hết hạn và auto refresh được bật
        if (timeUntilExpiry <= refreshThreshold && enableAutoRefresh) {
          console.log('Token sắp hết hạn, thực hiện auto refresh...');
          
          // Thử refresh token
          await checkAuthStatus();
          
          // Kiểm tra lại sau khi refresh
          const newToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
          if (newToken) {
            const newPayload = JSON.parse(atob(newToken.split('.')[1]));
            const newExpirationTime = newPayload.exp * 1000;
            const newTimeUntilExpiry = newExpirationTime - currentTime;
            
            if (newTimeUntilExpiry > refreshThreshold) {
              console.log('Auto refresh thành công');
            } else {
              throw new Error('Refresh token failed');
            }
          } else {
            throw new Error('No new token received');
          }
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
        throw error;
      }
    } catch (error) {
      console.error('Token validation failed, logging out...', error);
      
      // Show notification
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      
      // Logout user
      await logout();
    } finally {
      isCheckingRef.current = false;
    }
  }, [refreshThreshold, enableAutoRefresh, checkAuthStatus, logout]);

  // Bắt đầu monitoring
  const startMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Kiểm tra ngay lập tức
    checkTokenExpiration();

    // Thiết lập interval
    intervalRef.current = setInterval(checkTokenExpiration, checkInterval);
  }, [checkTokenExpiration, checkInterval]);

  // Dừng monitoring
  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Khởi tạo monitoring khi component mount
  useEffect(() => {
    const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
    
    if (accessToken && enableAutoRefresh) {
      startMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [startMonitoring, stopMonitoring, enableAutoRefresh]);

  // Restart monitoring khi user thay đổi
  useEffect(() => {
    const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
    
    if (accessToken && enableAutoRefresh) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
  }, [startMonitoring, stopMonitoring, enableAutoRefresh]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    checkTokenExpiration,
    startMonitoring,
    stopMonitoring
  };
}; 