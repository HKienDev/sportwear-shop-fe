"use client";

import { useAuth } from "@/context/authContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

const AuthButtons = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage || user) return null;

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/auth/login"
        className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg hover:from-gray-50 hover:to-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 hover:shadow-md"
      >
        <LogIn className="w-4 h-4 mr-2 text-gray-500 group-hover:text-purple-600 transition-colors duration-300" />
        <span className="relative z-10">Đăng Nhập</span>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
      </Link>
      <Link
        href="/auth/register"
        className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 rounded-lg hover:from-purple-700 hover:via-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      >
        <UserPlus className="w-4 h-4 mr-2 text-white/90 group-hover:text-white transition-colors duration-300" />
        <span className="relative z-10">Đăng Ký</span>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/10 transition-all duration-300"></div>
      </Link>
    </div>
  );
};

export default AuthButtons;