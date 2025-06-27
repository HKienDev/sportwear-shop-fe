'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { TOKEN_CONFIG } from '@/config/token';
import sessionManager from '@/utils/sessionManager';

interface TokenManagerProps {
  children: React.ReactNode;
}

const TokenManager: React.FC<TokenManagerProps> = ({ children }) => {
  const { checkAuthStatus, isAuthenticated } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkTokens = async () => {
      try {
        // Kiểm tra xem có token trong localStorage không
        const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
        const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);

        if (accessToken || refreshToken) {
          await checkAuthStatus();
        }
      } catch (error) {
        console.error('Error checking tokens:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkTokens();
  }, [checkAuthStatus]);

  // Khởi tạo session manager khi user đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      sessionManager.startActivityTracking();
    } else {
      sessionManager.stopActivityTracking();
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
        const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
        if (accessToken) {
          // Trigger token check
          window.dispatchEvent(new CustomEvent('checkToken'));
        }
      }
    };

    const handleOnline = () => {
      // Khi kết nối mạng trở lại, kiểm tra token
      const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      if (accessToken) {
        window.dispatchEvent(new CustomEvent('checkToken'));
      }
    };

    const handleTokenCheck = () => {
      checkAuthStatus();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('checkToken', handleTokenCheck);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('checkToken', handleTokenCheck);
    };
  }, [checkAuthStatus]);

  useEffect(() => {
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY || e.key === TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY) {
        const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
        const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);

        if (accessToken || refreshToken) {
          await checkAuthStatus();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAuthStatus]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default TokenManager; 