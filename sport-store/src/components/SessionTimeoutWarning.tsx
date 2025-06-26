'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/authContext';
import { TOKEN_CONFIG } from '@/config/token';
import { toast } from 'sonner';

interface SessionTimeoutWarningProps {
  warningThreshold?: number; // Thời gian (ms) trước khi hiển thị warning
}

export default function SessionTimeoutWarning({ 
  warningThreshold = 2 * 60 * 1000 // 2 phút
}: SessionTimeoutWarningProps) {
  const { logout, checkAuthStatus } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExtending, setIsExtending] = useState(false);

  const checkSessionExpiry = useCallback(() => {
    try {
      const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      
      if (!accessToken) {
        return;
      }

      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;

      if (timeUntilExpiry <= warningThreshold && timeUntilExpiry > 0) {
        setShowWarning(true);
        setTimeLeft(Math.ceil(timeUntilExpiry / 1000));
      } else if (timeUntilExpiry <= 0) {
        // Session đã hết hạn
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        logout();
      } else {
        setShowWarning(false);
      }
    } catch (error) {
      console.error('Error checking session expiry:', error);
    }
  }, [warningThreshold, logout]);

  const extendSession = useCallback(async () => {
    try {
      setIsExtending(true);
      await checkAuthStatus();
      
      // Kiểm tra lại sau khi extend
      const newToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      if (newToken) {
        const payload = JSON.parse(atob(newToken.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;
        
        if (timeUntilExpiry > warningThreshold) {
          setShowWarning(false);
          toast.success('Phiên đăng nhập đã được gia hạn');
        }
      }
    } catch (error) {
      console.error('Error extending session:', error);
      toast.error('Không thể gia hạn phiên đăng nhập');
    } finally {
      setIsExtending(false);
    }
  }, [checkAuthStatus, warningThreshold]);

  const handleLogout = useCallback(() => {
    setShowWarning(false);
    logout();
  }, [logout]);

  // Kiểm tra session mỗi giây khi warning hiển thị
  useEffect(() => {
    if (showWarning) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setShowWarning(false);
            logout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [showWarning, logout]);

  // Kiểm tra session định kỳ
  useEffect(() => {
    const interval = setInterval(checkSessionExpiry, 30000); // Kiểm tra mỗi 30 giây
    
    return () => clearInterval(interval);
  }, [checkSessionExpiry]);

  if (!showWarning) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Phiên đăng nhập sắp hết hạn
          </h3>
          
          <p className="text-gray-600 mb-4">
            Phiên đăng nhập của bạn sẽ hết hạn trong{' '}
            <span className="font-semibold text-red-600">{timeLeft}</span> giây.
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={extendSession}
              disabled={isExtending}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExtending ? 'Đang gia hạn...' : 'Gia hạn phiên'}
            </button>
            
            <button
              onClick={handleLogout}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 