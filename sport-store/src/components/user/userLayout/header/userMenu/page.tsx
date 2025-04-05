"use client";

import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { LogOut, User, ChevronDown, Package, Heart } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getProfile } from "@/services/authService";

interface UserProfile {
  fullname: string;
  email: string;
  membershipLevel?: string;
  totalSpent?: number;
}

const getMembershipStyle = (level?: string) => {
  switch (level) {
    case "Hạng Kim Cương":
      return {
        bg: "bg-gradient-to-r from-blue-500 to-purple-500",
        text: "text-white",
        hover: "hover:from-blue-600 hover:to-purple-600",
        button: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
      };
    case "Hạng Bạch Kim":
      return {
        bg: "bg-gradient-to-r from-[#4EB09D] to-[#3A8F7F]",
        text: "text-white",
        hover: "hover:from-[#3A8F7F] hover:to-[#2A6F5F]",
        button: "bg-gradient-to-r from-[#4EB09D] to-[#3A8F7F] hover:from-[#3A8F7F] hover:to-[#2A6F5F]"
      };
    case "Hạng Vàng":
      return {
        bg: "bg-gradient-to-r from-[#FFBE00] to-[#E5A800]",
        text: "text-white",
        hover: "hover:from-[#E5A800] hover:to-[#CC9200]",
        button: "bg-gradient-to-r from-[#FFBE00] to-[#E5A800] hover:from-[#E5A800] hover:to-[#CC9200]"
      };
    case "Hạng Bạc":
      return {
        bg: "bg-gradient-to-r from-[#797979] to-[#5C5C5C]",
        text: "text-white",
        hover: "hover:from-[#5C5C5C] hover:to-[#3F3F3F]",
        button: "bg-gradient-to-r from-[#797979] to-[#5C5C5C] hover:from-[#5C5C5C] hover:to-[#3F3F3F]"
      };
    case "Hạng Sắt":
      return {
        bg: "bg-gradient-to-r from-[#9C7F7F] to-[#7F6262]",
        text: "text-white",
        hover: "hover:from-[#7F6262] hover:to-[#624545]",
        button: "bg-gradient-to-r from-[#9C7F7F] to-[#7F6262] hover:from-[#7F6262] hover:to-[#624545]"
      };
    default:
      return {
        bg: "bg-gradient-to-r from-[#9C7F7F] to-[#7F6262]",
        text: "text-white",
        hover: "hover:from-[#7F6262] hover:to-[#624545]",
        button: "bg-gradient-to-r from-[#9C7F7F] to-[#7F6262] hover:from-[#7F6262] hover:to-[#624545]"
      };
  }
};

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const response = await getProfile();
          console.log("📊 UserMenu - Fetched profile:", response);
          if (response?.data?.user) {
            setUserProfile(response.data.user as UserProfile);
          }
        } catch (error) {
          console.error("❌ UserMenu - Error fetching profile:", error);
        }
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  if (!user || user.role !== "user") {
    console.log("❌ UserMenu - No user or not a user role:", user);
    return null;
  }

  const membershipStyle = getMembershipStyle(user.membershipLevel);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${membershipStyle.button} ${membershipStyle.text} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-md hover:shadow-lg`}
      >
        <span className="font-semibold truncate max-w-[150px]">
          {userProfile?.fullname || user?.fullname || "User"}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      {isMenuOpen && (
        <>
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 transform transition-all duration-200 ease-in-out animate-fadeIn">
            {/* User Info Section */}
            <div className={`px-4 py-3 border-b border-gray-100 ${membershipStyle.bg} rounded-t-2xl`}>
              <div className="flex-1">
                <h3 className={`text-lg font-bold ${membershipStyle.text} truncate`}>
                  {userProfile?.fullname || user?.fullname || "User"}
                </h3>
                <p className="text-sm font-medium text-white/90 truncate">{user?.email}</p>
              </div>
              {/* Membership Level Badge */}
              <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm ${membershipStyle.text} flex-shrink-0`}>
                  {user.membershipLevel || "Hạng Sắt"}
                </div>
                {user.totalSpent && (
                  <div className="text-sm font-semibold text-white/90 flex-shrink-0">
                    Đã chi: {user.totalSpent.toLocaleString('vi-VN')}đ
                  </div>
                )}
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link href="/user/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg mx-2">
                <User className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                <span className="truncate">Thông tin tài khoản</span>
              </Link>
              <Link href="/user/orders" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg mx-2">
                <Package className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                <span className="truncate">Đơn hàng của tôi</span>
              </Link>
              <Link href="/user/wishlist" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg mx-2">
                <Heart className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                <span className="truncate">Sản phẩm yêu thích</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors rounded-lg mx-2"
              >
                <LogOut className="w-5 h-5 mr-3 text-red-400 flex-shrink-0" />
                <span className="truncate">Đăng xuất</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;