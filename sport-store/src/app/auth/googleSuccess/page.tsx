"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/authContext";

const GoogleAuthHandler = () => {
  const { user, isAuthenticated, loginWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        // Lấy token từ URL parameters
        const token = searchParams.get('token');
        
        if (token) {
          console.log('🔑 Received JWT token from Google OAuth');
          
          // Gọi loginWithGoogle để xử lý authentication
          const result = await loginWithGoogle(token);
          
          if (result.success) {
            console.log('✅ Google authentication successful');
            
            // Kiểm tra xem user có cần hoàn thiện thông tin không
            const userData = result.user;
            if (userData && !userData.phone) {
              // User chưa có số điện thoại, redirect đến trang complete profile
              console.log('📝 User needs to complete profile');
              router.replace('/user/profile?complete=true');
            } else if (userData) {
              // User đã có đầy đủ thông tin, redirect bình thường
              const redirectPath = userData.role === 'admin' ? '/admin/dashboard' : '/user';
              router.replace(redirectPath);
            }
            return;
          } else {
            throw new Error('Google authentication failed');
          }
        } else {
          console.error('❌ No token found in URL parameters');
          router.replace('/auth/login?error=no_token');
        }
              } catch (error) {
          console.error('❌ Error during Google authentication:', error);
          router.replace('/auth/login?error=google_auth_failed');
        }
    };

    // Chỉ xử lý nếu chưa authenticated
    if (!isAuthenticated) {
      handleGoogleAuth();
    }
  }, [searchParams, loginWithGoogle, isAuthenticated, router]);

  // Redirect nếu đã authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Kiểm tra xem user có cần hoàn thiện thông tin không
      if (!user.phone) {
        router.replace('/user/profile?complete=true');
      } else {
        const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/user';
        router.replace(redirectPath);
      }
    }
  }, [isAuthenticated, user, router]);

  return <div className="text-center mt-10">Đang xử lý đăng nhập...</div>;
};

const GoogleSuccessPage = () => {
  return (
    <Suspense fallback={<div className="text-center mt-10">Đang tải...</div>}>
      <GoogleAuthHandler />
    </Suspense>
  );
};

export default GoogleSuccessPage;