"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { User, ShoppingBag, Heart, LogOut, ChevronDown, Crown } from 'lucide-react';
import Image from 'next/image';
import { getMembershipTier } from '@/utils/membershipUtils';
import { formatCurrency } from '@/utils/format';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Không cần gọi checkAuthStatus nữa vì context đã handle
        console.log('🔍 UserMenu - Auth initialized');
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    initializeAuth();
  }, []);

  // Xử lý click outside để đóng menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Nếu không có user hoặc chưa xác thực, không hiển thị menu
  if (!user || !isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      console.log('🔍 UserMenu - Starting logout process...');
      
      // Reload page ngay lập tức
      console.log('🔍 UserMenu - Reloading page immediately...');
      window.location.reload();
      
      // Gọi logout function (có thể không cần thiết nếu reload đã xảy ra)
      await logout();
      
    } catch (error) {
      console.error('Logout failed:', error);
      
      // Nếu có lỗi, vẫn reload page
      console.log('🔍 UserMenu - Logout failed, but reloading page anyway...');
      window.location.reload();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    {
      label: "Tài khoản của tôi",
      icon: <User className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: "/user/profile",
      disabled: false,
    },
    {
      label: "Đơn hàng của tôi",
      icon: <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: "/user/profile?tab=orders",
      disabled: false,
    },
    {
      label: "Danh sách yêu thích",
      icon: <Heart className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: "/user/wishlist",
      disabled: false,
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2 px-1.5 sm:px-2 md:px-2.5 py-1.5 sm:py-2 md:py-2.5 rounded-full hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 touch-friendly"
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={user.fullname || "User"}
              width={32}
              height={32}
              className="rounded-full object-cover w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9"
            />
          ) : (
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-xs sm:text-sm md:text-base font-medium text-white">
                {user?.fullname?.charAt(0) || user?.email?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-600 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute inset-x-2 sm:inset-x-auto sm:right-0 mt-2 w-auto sm:w-72 md:w-80 lg:w-96 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 transform transition-all duration-300 ease-out max-h-[80vh] overflow-y-auto">
          {/* User Info Section */}
          <div className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 border-b border-gray-100">
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.fullname || "User"}
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white">
                    {user?.fullname?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p 
                    className="text-sm sm:text-base md:text-lg font-semibold truncate"
                    style={{ 
                      color: getMembershipTier(user?.totalSpent || 0).color 
                    }}
                  >
                    {user?.fullname}
                  </p>
                  <Crown 
                    size={14} 
                    style={{ 
                      color: getMembershipTier(user?.totalSpent || 0).color 
                    }}
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            
            {/* User Stats */}
            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
              <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                <span className="font-semibold">Cấp thành viên:</span>
                <span 
                  className="font-semibold truncate ml-2"
                  style={{ 
                    color: getMembershipTier(user?.totalSpent || 0).color 
                  }}
                >
                  {getMembershipTier(user?.totalSpent || 0).name}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1 sm:mt-1.5">
                <span className="font-semibold">Tổng chi tiêu:</span>
                <span 
                  className="font-semibold truncate ml-2"
                  style={{ 
                    color: getMembershipTier(user?.totalSpent || 0).color 
                  }}
                >
                  {formatCurrency(user?.totalSpent || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
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
                className={`w-full px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base flex items-center space-x-2 sm:space-x-2.5 md:space-x-3 transition-colors duration-200 touch-friendly
                  ${item.disabled ? 'text-gray-400 cursor-not-allowed bg-gray-50' : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'}`}
                disabled={item.disabled}
              >
                <span className={`${item.disabled ? 'text-gray-300' : 'text-gray-400'} w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0`}>{item.icon}</span>
                <span className="truncate flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Logout Section */}
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`w-full px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base flex items-center space-x-2 sm:space-x-2.5 md:space-x-3 transition-all duration-300 touch-friendly ${
                isLoggingOut 
                  ? 'text-gray-400 bg-gray-50 cursor-not-allowed' 
                  : 'text-red-600 hover:bg-red-50 hover:text-red-700'
              }`}
            >
              {isLoggingOut ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 animate-spin rounded-full border-2 border-gray-300 border-t-red-600" />
              ) : (
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              )}
              <span className="flex-1 text-left">
                {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
