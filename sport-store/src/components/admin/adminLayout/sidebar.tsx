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
  Settings,
  LogOut,
  ShoppingCart,
  Tags,
  Gift,
  MessageSquare,
  UserCircle
} from "lucide-react";

const menuItems = [
  { name: "Trang Chủ", path: "/admin/dashboard", icon: LayoutDashboard, subMenu: [] },
  {
    name: "Đơn Hàng",
    path: "/admin/orders",
    icon: ShoppingCart,
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
    icon: Tags,
    subMenu: [
      { name: "Danh Sách", path: "/admin/categories/list" },
      { name: "Thêm Thể Loại", path: "/admin/categories/add" },
    ],
  },
  {
    name: "Khuyến Mãi",
    path: "/admin/promotions",
    icon: Gift,
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
    icon: UserCircle,
    subMenu: [
      { name: "Danh Sách", path: "/admin/accounts/list" },
      { name: "Thêm Tài Khoản", path: "/admin/accounts/add" },
    ],
  },
  {
    name: "Tin Nhắn",
    path: "/admin/messages",
    icon: MessageSquare,
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
      await logout();
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      window.location.href = '/auth/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-64 h-screen flex flex-col bg-white border-r fixed top-0 left-0">
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-[#4EB09D] to-[#2C7A7B] bg-clip-text text-transparent">
            VJU SPORT
          </span>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive =
              (item.path === "/admin" && pathname === "/admin") ||
              (item.path !== "/admin" && pathname.startsWith(item.path)) ||
              item.subMenu.some((sub) => pathname === sub.path);

            const isOpen = openMenus[item.path] || item.subMenu.some((sub) => pathname === sub.path);
            const Icon = item.icon;

            return (
              <div key={item.path} className="mb-1">
                {item.path === "logout" ? (
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-3 py-2 rounded-md font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <Icon size={18} className="group-hover:scale-110 transition-transform" />
                    {isLoggingOut ? 'Đang đăng xuất...' : item.name}
                  </button>
                ) : (
                  <div>
                    <button
                      onClick={() => {
                        if (item.subMenu.length > 0) {
                          toggleMenu(item.path);
                        } else {
                          router.push(item.path);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md transition-all font-medium flex items-center justify-between group ${
                        isActive && !isOpen 
                          ? "bg-[#4EB09D] text-white shadow-sm" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-[#4EB09D]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={`transition-transform group-hover:scale-110 ${
                          isActive ? "text-white" : "text-gray-400 group-hover:text-[#4EB09D]"
                        }`} />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.subMenu.length > 0 && (
                        <span className={`ml-2 flex-shrink-0 transition-all duration-300 ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}>
                          {isOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                        </span>
                      )}
                    </button>

                    {/* Submenu */}
                    {isOpen && item.subMenu.length > 0 && (
                      <div className="mt-1 space-y-1 pl-4">
                        {item.subMenu.map((subItem) => {
                          const isSubActive = pathname === subItem.path;
                          return (
                            <Link
                              key={subItem.path}
                              href={subItem.path}
                              className={`block px-3 py-2 rounded-md text-sm transition-all font-medium group ${
                                isSubActive 
                                  ? "bg-[#4EB09D] text-white shadow-sm" 
                                  : "text-gray-600 hover:bg-gray-50 hover:text-[#4EB09D]"
                              }`}
                            >
                              <span className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1 before:rounded-full before:bg-current before:opacity-50">
                                {subItem.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}