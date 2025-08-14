'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/authContext';
import { TOKEN_CONFIG } from '@/config/token';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface SessionTimeoutWarningProps {
  warningThreshold?: number; // Thời gian (ms) trước khi hiển thị warning
  checkInterval?: number; // Thời gian (ms) giữa các lần kiểm tra
}

export default function SessionTimeoutWarning({ 
  warningThreshold = 2 * 60 * 1000, // 2 phút
  checkInterval = 10000 // 10 giây - kiểm tra thường xuyên hơn
}: SessionTimeoutWarningProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExtending, setIsExtending] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      
      // Clear countdown timer trước
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      
      // Clear check interval
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      
      // Đóng modal trước
      setShowWarning(false);
      
      // Thực hiện logout
      await logout();
      
      // Redirect về trang chủ
      router.push('/');
      
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Có lỗi xảy ra khi đăng xuất');
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout, router]);

  const checkSessionExpiry = useCallback(() => {
    try {
      const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      
      if (!accessToken) {
        setShowWarning(false);
        return;
      }

      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;

      // Nếu token đã hết hạn
      if (timeUntilExpiry <= 0) {
        setShowWarning(false);
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        handleLogout();
        return;
      }

      // Nếu token sắp hết hạn trong khoảng warning threshold
      if (timeUntilExpiry <= warningThreshold) {
        setShowWarning(true);
        setTimeLeft(Math.ceil(timeUntilExpiry / 1000));
      } else {
        setShowWarning(false);
      }
    } catch (error) {
      console.error('Error checking session expiry:', error);
      setShowWarning(false);
      // Nếu có lỗi parse token, có thể token không hợp lệ
      toast.error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
      setTimeout(() => {
        handleLogout();
      }, 1000);
    }
  }, [warningThreshold, handleLogout]);

  const extendSession = useCallback(async () => {
    try {
      setIsExtending(true);
      
      // Gọi trực tiếp refresh token API thay vì checkAuthStatus
      const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to refresh token');
      }
      
      // Cập nhật tokens
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.data;
      localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, newAccessToken);
      localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY, newRefreshToken);
      
      // Kiểm tra lại sau khi extend
      const payload = JSON.parse(atob(newAccessToken.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;
      
      if (timeUntilExpiry > warningThreshold) {
        setShowWarning(false);
        toast.success('Phiên đăng nhập đã được gia hạn');
        
        // Clear countdown timer
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
      } else {
        // Nếu vẫn còn trong warning threshold, cập nhật timeLeft
        setTimeLeft(Math.ceil(timeUntilExpiry / 1000));
        toast.warning('Phiên đăng nhập vẫn sắp hết hạn. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error extending session:', error);
      toast.error('Không thể gia hạn phiên đăng nhập. Vui lòng đăng nhập lại.');
      
      // Nếu không thể gia hạn, logout sau 2 giây
      setTimeout(() => {
        handleLogout();
      }, 2000);
    } finally {
      setIsExtending(false);
    }
  }, [warningThreshold, handleLogout]);

  // Kiểm tra session định kỳ
  useEffect(() => {
    // Kiểm tra ngay lập tức
    checkSessionExpiry();
    
    checkIntervalRef.current = setInterval(checkSessionExpiry, checkInterval);
    
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [checkSessionExpiry, checkInterval]);

  // Countdown timer khi warning hiển thị
  useEffect(() => {
    if (showWarning) {
      countdownRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Clear interval trước khi logout
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
              countdownRef.current = null;
            }
            
            setShowWarning(false);
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
      };
    }
  }, [showWarning, handleLogout]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

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
              disabled={isExtending || isLoggingOut}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isExtending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang gia hạn...
                </>
              ) : (
                'Gia hạn phiên'
              )}
            </button>
            
            <button
              onClick={handleLogout}
              disabled={isExtending || isLoggingOut}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoggingOut ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang đăng xuất...
                </>
              ) : (
                'Đăng xuất'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 