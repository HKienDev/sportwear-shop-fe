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
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div className={`h-screen flex flex-col bg-white border-r fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-[clamp(4rem,8vw,5rem)]' : 'w-[clamp(240px,25vw,280px)]'
    }`}>
      {/* Logo */}
      <div className="flex h-[clamp(3rem,6vw,4rem)] items-center justify-between border-b px-[clamp(0.75rem,1.5vw,1rem)]">
        <Link href="/admin/dashboard" className={`flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] transition-opacity duration-300 ${
          isCollapsed ? 'opacity-0' : 'opacity-100'
        }`}>
          <span className="text-[clamp(0.875rem,1.5vw,1.25rem)] font-bold bg-gradient-to-r from-[#4EB09D] to-[#2C7A7B] bg-clip-text text-transparent whitespace-nowrap">
            VJU SPORT
          </span>
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-[clamp(0.25rem,0.5vw,0.5rem)] rounded-md hover:bg-gray-100 transition-all duration-300 group"
        >
          <svg
            className={`w-[clamp(0.875rem,1.5vw,1.25rem)] h-[clamp(0.875rem,1.5vw,1.25rem)] transition-all duration-300 ${
              isCollapsed ? 'rotate-180' : ''
            } group-hover:scale-110`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 5l7 7-7 7M5 5l7 7-7 7" 
              className={`transition-all duration-300 ${
                isCollapsed ? 'translate-x-1' : '-translate-x-1'
              }`}
            />
          </svg>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-[clamp(0.75rem,1.5vw,1rem)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        <div className="space-y-[clamp(0.25rem,0.5vw,0.5rem)] px-[clamp(0.5rem,1vw,0.75rem)]">
          {menuItems.map((item) => {
            const isActive =
              (item.path === "/admin" && pathname === "/admin") ||
              (item.path !== "/admin" && pathname.startsWith(item.path)) ||
              item.subMenu.some((sub) => pathname === sub.path);

            const isOpen = openMenus[item.path] || item.subMenu.some((sub) => pathname === sub.path);
            const Icon = item.icon;

            return (
              <div key={item.path} className="mb-[clamp(0.25rem,0.5vw,0.5rem)]">
                {item.path === "logout" ? (
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.5rem,1vw,0.75rem)] rounded-md font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <Icon size={16} className="group-hover:scale-110 transition-transform" />
                    <span className={`text-[clamp(0.75rem,1.5vw,1rem)] transition-opacity duration-300 ${
                      isCollapsed ? 'opacity-0' : 'opacity-100'
                    }`}>{isLoggingOut ? 'Đang đăng xuất...' : item.name}</span>
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
                      className={`w-full text-left px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.5rem,1vw,0.75rem)] rounded-md transition-all font-medium flex items-center justify-between group ${
                        isActive && !isOpen 
                          ? "bg-[#4EB09D] text-white shadow-sm" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-[#4EB09D]"
                      }`}
                    >
                      <div className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)]">
                        <Icon size={16} className={`transition-transform group-hover:scale-110 ${
                          isActive ? "text-white" : "text-gray-400 group-hover:text-[#4EB09D]"
                        }`} />
                        <span className={`text-[clamp(0.75rem,1.5vw,1rem)] truncate transition-opacity duration-300 ${
                          isCollapsed ? 'opacity-0' : 'opacity-100'
                        }`}>{item.name}</span>
                      </div>
                      {item.subMenu.length > 0 && !isCollapsed && (
                        <span className={`ml-[clamp(0.5rem,1vw,0.75rem)] flex-shrink-0 transition-all duration-300 ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}>
                          {isOpen ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                        </span>
                      )}
                    </button>

                    {/* Submenu */}
                    {isOpen && item.subMenu.length > 0 && !isCollapsed && (
                      <div className="mt-[clamp(0.25rem,0.5vw,0.5rem)] space-y-[clamp(0.25rem,0.5vw,0.5rem)] pl-[clamp(0.5rem,1vw,1rem)]">
                        {item.subMenu.map((subItem) => {
                          const isSubActive = pathname === subItem.path;
                          return (
                            <Link
                              key={subItem.path}
                              href={subItem.path}
                              className={`block px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.5rem,1vw,0.75rem)] rounded-md text-[clamp(0.75rem,1.5vw,1rem)] transition-all font-medium group ${
                                isSubActive 
                                  ? "bg-[#4EB09D] text-white shadow-sm" 
                                  : "text-gray-600 hover:bg-gray-50 hover:text-[#4EB09D]"
                              }`}
                            >
                              <span className="relative pl-[clamp(0.75rem,1.5vw,1rem)] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[clamp(0.25rem,0.5vw,0.5rem)] before:h-[clamp(0.25rem,0.5vw,0.5rem)] before:rounded-full before:bg-current before:opacity-50">
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

      {/* Expand Button - Only show when collapsed */}
      {isCollapsed && (
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1.5 md:p-2 rounded-full bg-white border shadow-sm hover:bg-gray-50 transition-colors group"
          >
            <svg
              className="w-3 h-3 md:w-4 md:h-4 text-gray-500 group-hover:text-[#4EB09D] transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}