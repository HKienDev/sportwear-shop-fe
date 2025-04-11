"use client";

import { useState, useEffect } from "react";
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
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Bell
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationCount] = useState(3);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Add animation class to menu items
  const getMenuItemClass = (index: number) => {
    return `animate-fadeIn animation-delay-${index * 100}`;
  };

  return (
    <div 
      className={`h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-r shadow-lg fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-[clamp(4rem,8vw,5rem)]' : 'w-[clamp(240px,25vw,280px)]'
      }`}
      style={{ 
        transform: `translateY(${scrollPosition}px)`,
        transition: 'transform 0.05s linear',
        willChange: 'transform'
      }}
    >
      {/* Logo */}
      <div className={`flex h-[clamp(4rem,8vw,5rem)] items-center justify-between px-[clamp(0.75rem,1.5vw,1rem)] ${
        isDarkMode 
          ? 'bg-gradient-to-r from-red-800 to-red-900 border-b border-red-700' 
          : 'bg-gradient-to-r from-red-500 to-red-700 border-b border-red-400'
      }`}>
        <Link href="/admin/dashboard" className={`flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] transition-opacity duration-300 ${
          isCollapsed ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className="p-1 bg-white rounded-full">
            <div className="h-6 w-6 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">VS</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[clamp(1rem,1.8vw,1.25rem)] font-bold text-white whitespace-nowrap leading-tight">
              VJU SPORT
            </span>
            <span className="text-[clamp(0.6rem,1vw,0.75rem)] text-red-100 whitespace-nowrap">
              Admin Dashboard
            </span>
          </div>
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-[clamp(0.25rem,0.5vw,0.5rem)] rounded-md ${
            isDarkMode 
              ? 'hover:bg-red-800 text-red-100' 
              : 'hover:bg-red-600 text-white'
          } transition-all duration-300 group`}
        >
          {isCollapsed ? (
            <ChevronRight size={18} className="group-hover:scale-110 transition-transform" />
          ) : (
            <ChevronLeft size={18} className="group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {/* User Status Area - Only visible when not collapsed */}
      {!isCollapsed && (
        <div className={`flex items-center justify-between p-3 ${
          isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-red-50 text-gray-700'
        } border-b ${isDarkMode ? 'border-gray-700' : 'border-red-100'}`}>
          <div className="flex items-center space-x-2">
            <div className={`h-8 w-8 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-md flex items-center justify-center`}>
              <UserCircle size={20} className={isDarkMode ? 'text-red-400' : 'text-red-500'} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium">Admin</span>
              <span className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatTime(currentTime)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleDarkMode} 
              className={`p-1.5 rounded-full transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button className={`p-1.5 rounded-full transition-colors relative ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}>
              <Bell size={14} />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <nav className={`flex-1 overflow-y-auto py-[clamp(0.75rem,1.5vw,1rem)] scrollbar-thin ${
        isDarkMode 
          ? 'scrollbar-thumb-gray-600 scrollbar-track-gray-800' 
          : 'scrollbar-thumb-gray-300 scrollbar-track-transparent'
      } hover:scrollbar-thumb-red-300`}>
        <div className="space-y-[clamp(0.25rem,0.5vw,0.5rem)] px-[clamp(0.5rem,1vw,0.75rem)]">
          {menuItems.map((item, index) => {
            const isActive =
              (item.path === "/admin" && pathname === "/admin") ||
              (item.path !== "/admin" && pathname.startsWith(item.path)) ||
              item.subMenu.some((sub) => pathname === sub.path);

            const isOpen = openMenus[item.path] || item.subMenu.some((sub) => pathname === sub.path);
            const Icon = item.icon;

            return (
              <div key={item.path} className={`mb-[clamp(0.25rem,0.5vw,0.5rem)] ${getMenuItemClass(index)}`}>
                {item.path === "logout" ? (
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`w-full text-left px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.5rem,1vw,0.75rem)] rounded-md font-medium 
                    ${isDarkMode 
                      ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                    } transition-all flex items-center gap-[clamp(0.5rem,1vw,0.75rem)] disabled:opacity-50 disabled:cursor-not-allowed group`}
                  >
                    <div className={`p-1.5 rounded-md ${
                      isDarkMode ? 'bg-red-900/50' : 'bg-white'
                    } shadow-sm group-hover:shadow-md transition-all`}>
                      <Icon size={14} className="group-hover:scale-110 transition-transform" />
                    </div>
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
                          ? isDarkMode
                            ? "bg-gradient-to-r from-red-900 to-red-800 text-white shadow-lg"
                            : "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md"
                          : isDarkMode
                            ? "text-gray-300 hover:bg-gray-800 hover:text-red-400"
                            : "text-gray-700 hover:bg-gray-50 hover:text-red-600"
                      }`}
                    >
                      <div className="flex items-center gap-[clamp(0.5rem,1vw,0.75rem)]">
                        <div className={`p-1.5 rounded-md ${
                          isActive
                            ? isDarkMode
                              ? "bg-red-800"
                              : "bg-red-500"
                            : isDarkMode
                              ? "bg-gray-800 group-hover:bg-gray-700"
                              : "bg-gray-100 group-hover:bg-white"
                        } shadow-sm group-hover:shadow-md transition-all`}>
                          <Icon size={14} className={`transition-transform group-hover:scale-110 ${
                            isActive
                              ? "text-white"
                              : isDarkMode
                                ? "text-gray-400 group-hover:text-red-400"
                                : "text-gray-500 group-hover:text-red-600"
                          }`} />
                        </div>
                        <span className={`text-[clamp(0.75rem,1.5vw,1rem)] truncate transition-opacity duration-300 ${
                          isCollapsed ? 'opacity-0' : 'opacity-100'
                        }`}>{item.name}</span>
                      </div>
                      {item.subMenu.length > 0 && !isCollapsed && (
                        <span className={`ml-[clamp(0.5rem,1vw,0.75rem)] flex-shrink-0 transition-all duration-300 ${
                          isActive ? "text-white" : isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}>
                          {isOpen ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                        </span>
                      )}
                    </button>

                    {/* Submenu */}
                    {isOpen && item.subMenu.length > 0 && !isCollapsed && (
                      <div className="mt-[clamp(0.25rem,0.5vw,0.5rem)] space-y-[clamp(0.25rem,0.5vw,0.5rem)] pl-[clamp(1rem,2vw,1.5rem)]">
                        {item.subMenu.map((subItem, subIndex) => {
                          const isSubActive = pathname === subItem.path;
                          return (
                            <Link
                              key={subItem.path}
                              href={subItem.path}
                              className={`block px-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.5rem,1vw,0.75rem)] rounded-md text-[clamp(0.75rem,1.5vw,1rem)] transition-all font-medium group ${
                                isSubActive
                                  ? isDarkMode
                                    ? "bg-red-900/20 text-red-400 border-l-2 border-red-700"
                                    : "bg-red-50 text-red-600 border-l-2 border-red-600"
                                  : isDarkMode
                                    ? "text-gray-400 hover:bg-gray-800/50 hover:text-red-400 hover:border-l-2 hover:border-red-900"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-red-600 hover:border-l-2 hover:border-red-300"
                              } ${getMenuItemClass(subIndex)}`}
                            >
                              <span className="relative pl-[clamp(0.75rem,1.5vw,1rem)] flex items-center before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[clamp(0.25rem,0.5vw,0.5rem)] before:h-[clamp(0.25rem,0.5vw,0.5rem)] before:rounded-full before:bg-current before:opacity-70">
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

      {/* Footer - Only visible when not collapsed */}
      {!isCollapsed && (
        <div className={`p-4 border-t ${
          isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100'
        } mt-auto`}>
          <div className={`flex items-center justify-between ${
            isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'
          } p-2 rounded-md`}>
            <span className="text-xs">VJU SPORT</span>
            <span className="text-xs">&copy; 2025</span>
          </div>
        </div>
      )}

      {/* Expand Button - Only show when collapsed */}
      {isCollapsed && (
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
          <button
            onClick={() => setIsCollapsed(false)}
            className={`p-1.5 md:p-2 rounded-full ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-red-500 hover:bg-gray-700' 
                : 'bg-white border border-gray-200 text-red-600 hover:bg-gray-50'
            } shadow-lg hover:shadow-xl transition-all group`}
          >
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-all duration-300" />
          </button>
        </div>
      )}
    </div>
  );
}