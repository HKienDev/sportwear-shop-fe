"use client";

import { useAuth } from "@/context/authContext";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { getJustLoggedOut } from "@/utils/navigationUtils";

const AuthButtons = () => {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname.startsWith("/auth");

  // Debug log để kiểm tra trạng thái
  useEffect(() => {
    console.log('🔍 AuthButtons - Current state:', {
      isAuthenticated,
      isAuthPage,
      pathname
    });
  }, [isAuthenticated, isAuthPage, pathname]);

  // Kiểm tra trạng thái xác thực khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Kiểm tra flag justLoggedOut trước khi gọi checkAuthStatus
        if (getJustLoggedOut()) {
          console.log('🚫 AuthButtons - Just logged out, skipping auth check');
          return;
        }
        
        console.log('🔍 AuthButtons - Checking auth status...');
        await checkAuthStatus();
      } catch (error) {
        console.error("❌ Error checking auth status:", error);
      }
    };
    checkAuth();
  }, [checkAuthStatus]);

  // Không hiển thị nút khi đã đăng nhập hoặc đang ở trang auth
  if (isAuthPage || isAuthenticated) {
    console.log('🚫 AuthButtons - Hiding buttons:', { isAuthPage, isAuthenticated });
    return null;
  }

  console.log('✅ AuthButtons - Showing buttons');

  const handleLogin = async () => {
    try {
      // Chuyển hướng trực tiếp đến trang đăng nhập
      router.push('/auth/login');
    } catch (error) {
      console.error("❌ Error navigating to login:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  const handleRegister = async () => {
    try {
      // Chuyển hướng trực tiếp đến trang đăng ký
      router.push('/auth/register');
    } catch (error) {
      console.error("❌ Error navigating to register:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 xl:gap-4">
      <button
        onClick={handleLogin}
        className="group relative inline-flex items-center justify-center px-2 sm:px-2.5 lg:px-3 xl:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg hover:from-gray-50 hover:to-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 hover:shadow-md"
      >
        <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 mr-1 sm:mr-1.5 lg:mr-2 text-gray-500 group-hover:text-purple-600 transition-colors duration-300" />
        <span className="relative z-10 hidden sm:inline">Đăng Nhập</span>
        <span className="relative z-10 sm:hidden">Đăng nhập</span>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
      </button>
      <button
        onClick={handleRegister}
        className="group relative inline-flex items-center justify-center px-2 sm:px-2.5 lg:px-3 xl:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 rounded-lg hover:from-purple-700 hover:via-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      >
        <UserPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 mr-1 sm:mr-1.5 lg:mr-2 text-white/90 group-hover:text-white transition-colors duration-300" />
        <span className="relative z-10 hidden sm:inline">Đăng Ký</span>
        <span className="relative z-10 sm:hidden">Đăng ký</span>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/10 transition-all duration-300"></div>
      </button>
    </div>
  );
};

export default AuthButtons;