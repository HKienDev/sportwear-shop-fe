'use client';

import { useTokenManager } from '@/hooks/useTokenManager';
import { useAuth } from '@/context/authContext';
import { useEffect } from 'react';
import sessionManager from '@/utils/sessionManager';

interface TokenManagerProps {
  children?: React.ReactNode;
}

export default function TokenManager({ children }: TokenManagerProps) {
  const { isAuthenticated } = useAuth();
  
  // Sử dụng token manager với cấu hình tối ưu cho e-commerce
  useTokenManager({
    refreshThreshold: 10 * 60 * 1000, // Refresh 10 phút trước khi hết hạn
    checkInterval: 2 * 60 * 1000, // Kiểm tra mỗi 2 phút
    enableAutoRefresh: isAuthenticated
  });

  // Khởi tạo session manager khi user đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      sessionManager.startActivityTracking();
    } else {
      sessionManager.stopActivityTracking();
      sessionManager.clearSession();
    }

    return () => {
      sessionManager.stopActivityTracking();
    };
  }, [isAuthenticated]);

  // Thêm event listeners để handle tab visibility và online/offline
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Khi tab trở nên visible, kiểm tra token
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          // Trigger token check
          window.dispatchEvent(new CustomEvent('checkToken'));
        }
      }
    };

    const handleOnline = () => {
      // Khi kết nối mạng trở lại, kiểm tra token
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        window.dispatchEvent(new CustomEvent('checkToken'));
      }
    };

    const handleRefreshToken = () => {
      // Trigger token refresh khi có event
      window.dispatchEvent(new CustomEvent('checkToken'));
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('refreshToken', handleRefreshToken);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('refreshToken', handleRefreshToken);
    };
  }, []);

  return <>{children}</>;
} 