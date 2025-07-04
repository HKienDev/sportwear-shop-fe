"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from '@/context/authContext';
import { User, ShoppingBag, Heart, LogOut } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { name: "Thông tin cá nhân", path: "/user/profile", icon: User },
  { name: "Đơn hàng của tôi", path: "/user/profile?tab=orders", icon: ShoppingBag },
  { name: "Yêu thích (coming soon)", path: "#", icon: Heart, disabled: true },
];

export default function UserSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      window.location.href = '/auth/login';
    } catch {
      window.location.href = '/auth/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0 lg:static lg:inset-0 w-[clamp(200px,22vw,240px)] bg-white border-r shadow-lg flex flex-col`}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b bg-gradient-to-r from-blue-500 to-blue-700">
        <Link href="/user/profile" className="flex items-center gap-2">
          <div className="p-1 bg-white rounded-full">
            <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">US</span>
            </div>
          </div>
          <span className="text-base font-bold text-white whitespace-nowrap leading-tight">SportWear User</span>
        </Link>
        {/* Close button on mobile */}
        <button
          className="lg:hidden ml-auto p-2 text-white hover:text-blue-200 focus:outline-none"
          onClick={onClose}
          aria-label="Đóng menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (item.path.includes('?tab=orders') && pathname.startsWith('/user/profile'));
          return (
            <button
              key={item.name}
              disabled={item.disabled}
              onClick={() => {
                if (!item.disabled) router.push(item.path);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium
                ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </button>
          );
        })}
      </nav>
      {/* Logout */}
      <div className="border-t p-3">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}