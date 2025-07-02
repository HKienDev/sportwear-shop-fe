"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/base';
import { useAuthState } from '@/hooks/useAuthState';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthState();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // Nếu đã đăng nhập, xử lý chuyển hướng dựa trên role
        if (isAuthenticated && user) {
          console.log('👤 User đã đăng nhập, thực hiện chuyển hướng:', {
            role: user.role,
            currentPath: window.location.pathname
          });

          // Chuyển hướng dựa trên role
          if (user.role === UserRole.ADMIN) {
            console.log('👑 User là admin, chuyển hướng đến dashboard');
            router.replace('/admin/dashboard');
          } else {
            console.log('👤 User là user thường, chuyển hướng đến trang user');
            router.replace('/user');
          }
        } else {
          console.log('🔒 User chưa đăng nhập, chuyển hướng về trang login');
          router.replace('/auth/login');
        }
      } catch (error) {
        console.error('❌ Lỗi khi kiểm tra xác thực:', error);
        // Nếu có lỗi, chuyển hướng về trang login
        router.push('/auth/login');
      }
    };

    // Thực hiện kiểm tra và chuyển hướng
    checkAuthAndRedirect();
  }, [isAuthenticated, user, router]);

  // Không render gì cả khi đang xử lý chuyển hướng
  return null;
} 