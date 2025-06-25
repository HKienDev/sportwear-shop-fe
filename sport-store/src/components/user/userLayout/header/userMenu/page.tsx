"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { LogOut, User, ShoppingBag, Heart, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { formatCurrency } from "@/utils/format";
import { getJustLoggedOut } from "@/utils/navigationUtils";

const UserMenu = () => {
  const { user, logout, isAuthenticated, checkAuthStatus } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Kiểm tra flag justLoggedOut trước khi gọi checkAuthStatus
        if (getJustLoggedOut()) {
          console.log("🚫 Just logged out, skipping auth check in UserMenu");
          setIsLoading(false);
          return;
        }
        
        await checkAuthStatus();
      } catch (error) {
        console.error("❌ Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [checkAuthStatus]);

  // Xử lý click outside để đóng menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Log để debug
  console.log("🔍 UserMenu - Auth state:", {
    user,
    isAuthenticated,
    isLoading,
    hasUser: !!user,
    userRole: user?.role
  });

  // Không hiển thị gì khi đang loading
  if (isLoading) {
    return null;
  }

  // Nếu không có user hoặc chưa xác thực, không hiển thị menu
  if (!user || !isAuthenticated) {
    console.log("❌ UserMenu - No user or not authenticated");
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Đăng xuất thành công");
      router.push("/");
    } catch (error) {
      console.error("❌ Error logging out:", error);
      toast.error("Có lỗi xảy ra khi đăng xuất");
    }
  };

  const menuItems = [
    {
      label: "Tài khoản của tôi",
      icon: <User className="w-4 h-4" />,
      href: "/user/profile",
      disabled: false,
    },
    {
      label: "Đơn hàng của tôi",
      icon: <ShoppingBag className="w-4 h-4" />,
      href: "/user/profile?tab=orders",
      disabled: false,
    },
    {
      label: "Danh sách yêu thích (coming soon)",
      icon: <Heart className="w-4 h-4" />,
      href: "#",
      disabled: true,
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-3 py-2 rounded-full hover:bg-gray-100 transition-all duration-300 focus:outline-none"
      >
        <div className="flex items-center space-x-2">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={user.fullname || "User"}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.fullname?.charAt(0) || user?.email?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 transform transition-all duration-300 ease-out">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.fullname || "User"}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-lg font-medium text-white">
                    {user?.fullname?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{user?.fullname}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Cấp thành viên:</span>
                <span className="font-medium text-purple-600">{user?.membershipLevel}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Tổng chi tiêu:</span>
                <span className="font-medium text-green-600">{formatCurrency(user?.totalSpent || 0)}</span>
              </div>
            </div>
          </div>

          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!item.disabled) {
                    router.push(item.href);
                    setIsOpen(false);
                  }
                }}
                className={`w-full px-4 py-2.5 text-sm flex items-center space-x-3 transition-colors duration-200
                  ${item.disabled ? 'text-gray-400 cursor-not-allowed bg-gray-50' : 'text-gray-700 hover:bg-gray-50'}`}
                disabled={item.disabled}
              >
                <span className={item.disabled ? 'text-gray-300' : 'text-gray-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
