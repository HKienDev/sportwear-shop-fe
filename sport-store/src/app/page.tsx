"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/base';
import { useAuthState } from '@/hooks/useAuthState';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthState();

  useEffect(() => {
    // Luôn redirect về /user cho khách vãng lai hoặc user thường, /admin/dashboard cho admin
    if (isAuthenticated && user) {
      if (user.role === UserRole.ADMIN) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/user');
      }
    } else {
      // Khách vãng lai
      router.replace('/user');
    }
  }, [isAuthenticated, user, router]);

  // Không render gì cả khi đang xử lý chuyển hướng
  return null;
} 