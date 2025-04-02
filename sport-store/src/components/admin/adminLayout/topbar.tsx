'use client';

import { useState } from 'react';
import { useAuth } from '@/context/authContext';
import { ROUTES } from '@/config/constants';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TopbarProps {
  onMenuClick: () => void;
}

interface AuthUser {
  name?: string;
  email?: string;
  fullname?: string;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.replace(ROUTES.LOGIN);
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      router.replace(ROUTES.LOGIN);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="h-[clamp(3rem,6vw,4rem)] border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-full items-center justify-between px-[clamp(1rem,2vw,1.5rem)] sm:px-[clamp(1.5rem,3vw,2rem)] lg:px-[clamp(2rem,4vw,3rem)]">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-[clamp(0.5rem,1vw,0.75rem)] rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4EB09D] transition-all duration-200"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="h-[clamp(1.25rem,2.5vw,1.75rem)] w-[clamp(1.25rem,2.5vw,1.75rem)]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-[clamp(300px,50vw,600px)] mx-[clamp(1rem,2vw,1.5rem)] sm:mx-[clamp(1.5rem,3vw,2rem)] lg:mx-[clamp(2rem,4vw,3rem)]">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.5rem,1vw,0.75rem)] pl-[clamp(2.5rem,4vw,3rem)] text-[clamp(0.75rem,1.5vw,1rem)] bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4EB09D] focus:border-transparent transition-all duration-200"
            />
            <div className="absolute inset-y-0 left-[clamp(0.75rem,1.5vw,1rem)] flex items-center pointer-events-none">
              <svg
                className="h-[clamp(1rem,2vw,1.25rem)] w-[clamp(1rem,2vw,1.25rem)] text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-[clamp(0.5rem,1vw,1rem)] sm:gap-[clamp(1rem,2vw,1.5rem)]">
          {/* Notifications */}
          <button className="p-[clamp(0.5rem,1vw,0.75rem)] rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4EB09D] transition-all duration-200 group relative">
            <span className="sr-only">View notifications</span>
            <svg
              className="h-[clamp(1.25rem,2.5vw,1.5rem)] w-[clamp(1.25rem,2.5vw,1.5rem)] transition-transform duration-200 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
            <span className="absolute top-0 right-0 block h-[clamp(0.5rem,1vw,0.75rem)] w-[clamp(0.5rem,1vw,0.75rem)] rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] sm:gap-[clamp(0.75rem,1.5vw,1rem)] p-[clamp(0.5rem,1vw,0.75rem)] rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4EB09D] transition-all duration-200 group"
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-[clamp(2rem,4vw,2.5rem)] w-[clamp(2rem,4vw,2.5rem)] rounded-full bg-[#4EB09D] flex items-center justify-center text-white font-medium text-[clamp(0.75rem,1.5vw,1rem)]">
                {(user as AuthUser)?.fullname?.[0] || "U"}
              </div>
              <span className="hidden sm:block text-[clamp(0.75rem,1.5vw,1rem)] font-medium text-gray-700">
                {(user as AuthUser)?.fullname || "User"}
              </span>
              <svg
                className={`h-[clamp(1rem,2vw,1.25rem)] w-[clamp(1rem,2vw,1.25rem)] transition-transform duration-200 ${
                  isUserMenuOpen ? "rotate-180" : ""
                } group-hover:scale-110`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-[clamp(0.5rem,1vw,1rem)] w-[clamp(12rem,20vw,14rem)] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-[clamp(0.25rem,0.5vw,0.5rem)]">
                  <Link
                    href="/admin/profile"
                    className="block px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.5rem,1vw,0.75rem)] text-[clamp(0.75rem,1.5vw,1rem)] text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Thông tin cá nhân
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="block px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.5rem,1vw,0.75rem)] text-[clamp(0.75rem,1.5vw,1rem)] text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Cài đặt
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.5rem,1vw,0.75rem)] text-[clamp(0.75rem,1.5vw,1rem)] text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}