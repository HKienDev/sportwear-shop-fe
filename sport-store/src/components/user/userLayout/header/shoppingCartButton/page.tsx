"use client";

import { useCartOptimized } from "@/hooks/useCartOptimized";
import { useAuth } from "@/context/authContext";
import { useAuthModal } from "@/context/authModalContext";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getJustLoggedOut } from "@/utils/navigationUtils";
import { useEffect } from "react";

const ShoppingCartButton = () => {
  const { cart } = useCartOptimized();
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const { openModal } = useAuthModal();
  const router = useRouter();
  const itemCount = cart?.items?.length || 0;

  const handleCartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      // Mở auth modal thay vì redirect
      openModal({
        title: 'Đăng nhập để xem giỏ hàng',
        description: 'Vui lòng đăng nhập để xem giỏ hàng của bạn',
        pendingAction: {
          type: 'viewCart',
          callback: () => {
            router.push('/user/cart');
          }
        }
      });
      return;
    }
    
    // Nếu đã xác thực, chuyển hướng đến giỏ hàng
    router.push('/user/cart');
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Kiểm tra flag justLoggedOut
        if (getJustLoggedOut()) {
          return;
        }
        
        // Chỉ check auth nếu chưa có thông tin auth
        if (!isAuthenticated) {
          await checkAuthStatus();
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();
  }, []); // Chỉ chạy một lần khi component mount

  return (
    <Link
      href="/user/cart"
      onClick={handleCartClick}
      className="group relative inline-flex items-center justify-center p-1.5 sm:p-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
    >
      {/* Icon giỏ hàng với hiệu ứng hover */}
      <ShoppingCart className="w-4.5 h-4.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600 group-hover:text-purple-600 transition-colors duration-300" />
      
      {/* Badge hiển thị số lượng sản phẩm */}
      {itemCount > 0 && (
        <div className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] sm:min-w-[18px] lg:min-w-[20px] h-4 sm:h-4.5 lg:h-5 px-1 sm:px-1.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-medium rounded-full shadow-sm group-hover:shadow-md transition-all duration-300">
          <span className="text-xs">{itemCount > 99 ? '99+' : itemCount}</span>
        </div>
      )}

      {/* Tooltip khi hover - Ẩn trên mobile */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap hidden sm:block">
        Giỏ hàng
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>

      {/* Hiệu ứng ripple khi click */}
      <div className="absolute inset-0 rounded-lg bg-purple-500/0 group-hover:bg-purple-500/5 transition-all duration-300"></div>
    </Link>
  );
};

export default ShoppingCartButton;