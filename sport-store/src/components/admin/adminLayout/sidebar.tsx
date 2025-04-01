"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useAuth } from '@/context/authContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ClipboardList, 
  Settings,
  LogOut 
} from "lucide-react";

const menuItems = [
  { name: "Trang Chủ", path: "/admin/dashboard", icon: LayoutDashboard, subMenu: [] },
  {
    name: "Đơn Hàng",
    path: "/admin/orders",
    icon: ClipboardList,
    subMenu: [
      { name: "Danh Sách", path: "/admin/orders/list" },
      { name: "Thêm Đơn Hàng", path: "/admin/orders/add" },
    ],
  },
  {
    name: "Sản Phẩm",
    path: "/admin/products",
    icon: Package,
    subMenu: [
      { name: "Danh Sách", path: "/admin/products/list" },
      { name: "Thêm Sản Phẩm", path: "/admin/products/add" },
    ],
  },
  {
    name: "Thể Loại",
    path: "/admin/categories",
    icon: Package,
    subMenu: [
      { name: "Danh Sách", path: "/admin/categories/list" },
      { name: "Thêm Thể Loại", path: "/admin/categories/add" },
    ],
  },
  {
    name: "Khuyến Mãi",
    path: "/admin/promotions",
    icon: Package,
    subMenu: [
      { name: "Danh Sách", path: "/admin/coupons/list" },
      { name: "Thêm Khuyến Mãi", path: "/admin/coupons/add" },
    ],
  },
  {
    name: "Khách Hàng",
    path: "/admin/customers/list",
    icon: Users,
    subMenu: [],
  },
  {
    name: "Tài Khoản",
    path: "/admin/accounts",
    icon: Users,
    subMenu: [
      { name: "Danh Sách", path: "/admin/accounts/list" },
      { name: "Thêm Tài Khoản", path: "/admin/accounts/add" },
    ],
  },
  {
    name: "Tin Nhắn",
    path: "/admin/messages",
    icon: ClipboardList,
    subMenu: [],
  },
  {
    name: "Cấu Hình Hệ Thống",
    path: "/admin/settings",
    icon: Settings,
    subMenu: [
      { name: "Cài Đặt Chung", path: "/admin/settings/general" },
      { name: "Bảo Mật", path: "/admin/settings/security" },
    ],
  },
  {
    name: "Đăng Xuất",
    path: "logout",
    icon: LogOut,
    subMenu: [],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Toggle menu con
  const toggleMenu = (menuPath: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuPath]: !prev[menuPath],
    }));
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Gọi API logout
      await logout();
      // Chuyển hướng về trang login
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      // Vẫn chuyển hướng về trang login ngay cả khi có lỗi
      window.location.href = '/auth/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 p-4 flex flex-col shadow-sm">
      {/* Logo + Gạch dưới */}
      <div className="text-xl font-bold text-center pb-4 border-b border-gray-100">
        <span className="bg-gradient-to-r from-[#4EB09D] to-[#2C7A7B] bg-clip-text text-transparent">
          VJU SPORT
        </span>
      </div>

      <ul className="mt-6 flex-grow space-y-1">
        {menuItems.map((item) => {
          const isActive =
            (item.path === "/admin" && pathname === "/admin") ||
            (item.path !== "/admin" && pathname.startsWith(item.path)) ||
            item.subMenu.some((sub) => pathname === sub.path);

          const isOpen = openMenus[item.path] || item.subMenu.some((sub) => pathname === sub.path);
          const Icon = item.icon;

          return (
            <li key={item.path} className="relative">
              {item.path === "logout" ? (
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Icon size={20} className="group-hover:scale-110 transition-transform" />
                  {isLoggingOut ? 'Đang đăng xuất...' : item.name}
                </button>
              ) : (
                <div
                  onClick={() => {
                    if (item.subMenu.length > 0) {
                      toggleMenu(item.path);
                    } else {
                      router.push(item.path);
                    }
                  }}
                  className={`flex justify-between items-center px-4 py-3 rounded-lg transition-all font-medium cursor-pointer group ${
                    isActive && !isOpen 
                      ? "bg-[#4EB09D] text-white shadow-sm" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#4EB09D]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className={`transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-gray-400 group-hover:text-[#4EB09D]"
                    }`} />
                    {item.name}
                  </div>
                  {item.subMenu.length > 0 && (
                    <span className={`ml-2 transition-all duration-300 ${
                      isActive ? "text-white" : "text-gray-400"
                    }`}>
                      {isOpen ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
                    </span>
                  )}
                </div>
              )}

              {/* Menu con */}
              {isOpen && item.subMenu.length > 0 && (
                <ul className="pl-4 mt-2 space-y-1 transition-all duration-300">
                  {item.subMenu.map((subItem) => {
                    const isSubActive = pathname === subItem.path;
                    return (
                      <li key={subItem.path}>
                        <Link
                          href={subItem.path}
                          className={`block px-4 py-2 rounded-lg transition-all font-medium group ${
                            isSubActive 
                              ? "bg-[#4EB09D] text-white shadow-sm" 
                              : "text-gray-600 hover:bg-gray-50 hover:text-[#4EB09D]"
                          }`}
                        >
                          <span className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1 before:rounded-full before:bg-current before:opacity-50">
                            {subItem.name}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}