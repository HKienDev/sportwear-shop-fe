"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/authContext';

const GoogleAuthCallback: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, checkAuthStatus } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        console.log('Google callback received:', { 
          hasToken: !!token, 
          hasError: !!error,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'null'
        });

        if (error) {
          setError('Đăng nhập Google thất bại. Vui lòng thử lại.');
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
          return;
        }

        if (token) {
          // Lưu token vào localStorage
          localStorage.setItem('accessToken', token);
          
          // Kiểm tra và cập nhật trạng thái auth
          await checkAuthStatus();
          
          // Chuyển hướng về trang chủ
          router.push('/');
        } else {
          setError('Không nhận được token từ Google. Vui lòng thử lại.');
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
        }
      } catch (error) {
        console.error('Google callback error:', error);
        setError('Có lỗi xảy ra khi xử lý đăng nhập. Vui lòng thử lại.');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, router, setUser, checkAuthStatus]);

  if (isProcessing) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xử lý đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Đăng nhập thất bại</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Đang chuyển hướng về trang đăng nhập...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleAuthCallback; 