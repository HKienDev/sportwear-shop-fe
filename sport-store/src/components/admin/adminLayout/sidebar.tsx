"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from '@/context/authContext';
import { 
  Users, 
  Package, 
  Settings,
  LogOut,
  ShoppingCart,
  Tags,
  Gift,
  MessageSquare,
  UserCircle,
  Sun,
  Moon,
  ChevronDown,
  Search,
  Home,
  Activity
} from "lucide-react";

// Hook để lấy thống kê đơn hàng
const useOrderStats = () => {
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        
        if (data.success && data.data) {
          // Lấy tổng số đơn hàng từ dashboard stats
          setOrderCount(data.data.totalOrders || 0);
        }
      } catch (error) {
        console.error('Error fetching order stats:', error);
        setOrderCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderStats();
  }, []);

  return { orderCount, isLoading };
};

const menuItems = [
  { 
    name: "Tổng Quan", 
    path: "/admin/dashboard", 
    icon: Home, 
    subMenu: [],
    badge: null,
    description: "Thống kê tổng quan",
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Đơn Hàng",
    path: "/admin/orders",
    icon: ShoppingCart,
    subMenu: [
      { name: "Danh Sách", path: "/admin/orders/list" },
      { name: "Thêm Đơn Hàng", path: "/admin/orders/add" },
    ],
    badge: "dynamic", // Sẽ được thay thế bằng số thực tế
    description: "Quản lý đơn hàng",
    color: "from-green-500 to-emerald-500"
  },
  {
    name: "Sản Phẩm",
    path: "/admin/products",
    icon: Package,
    subMenu: [
      { name: "Danh Sách", path: "/admin/products/list" },
      { name: "Thêm Sản Phẩm", path: "/admin/products/add" },
    ],
    badge: null,
    description: "Quản lý sản phẩm",
    color: "from-purple-500 to-violet-500"
  },
  {
    name: "Thể Loại",
    path: "/admin/categories",
    icon: Tags,
    subMenu: [
      { name: "Danh Sách", path: "/admin/categories/list" },
      { name: "Thêm Thể Loại", path: "/admin/categories/add" },
    ],
    badge: null,
    description: "Phân loại sản phẩm",
    color: "from-orange-500 to-red-500"
  },
  {
    name: "Khuyến Mãi",
    path: "/admin/promotions",
    icon: Gift,
    subMenu: [
      { name: "Danh Sách", path: "/admin/coupons/list" },
      { name: "Thêm Khuyến Mãi", path: "/admin/coupons/add" },
    ],
    badge: "Hot",
    description: "Chương trình khuyến mãi",
    color: "from-pink-500 to-rose-500"
  },
  {
    name: "Khách Hàng",
    path: "/admin/customers/list",
    icon: Users,
    subMenu: [],
    badge: null,
    description: "Quản lý khách hàng",
    color: "from-indigo-500 to-blue-500"
  },
  {
    name: "Tài Khoản",
    path: "/admin/accounts",
    icon: UserCircle,
    subMenu: [
      { name: "Danh Sách", path: "/admin/accounts/list" },
      { name: "Thêm Tài Khoản", path: "/admin/accounts/add" },
    ],
    badge: null,
    description: "Quản lý tài khoản",
    color: "from-teal-500 to-cyan-500"
  },
  {
    name: "Tin Nhắn",
    path: "/admin/messages",
    icon: MessageSquare,
    subMenu: [],
    badge: "5",
    description: "Hỗ trợ khách hàng",
    color: "from-yellow-500 to-orange-500"
  },
  {
    name: "Cấu Hình",
    path: "/admin/settings",
    icon: Settings,
    subMenu: [
      { name: "Cài Đặt Chung", path: "/admin/settings/general" },
      { name: "Bảo Mật", path: "/admin/settings/security" },
    ],
    badge: null,
    description: "Cài đặt hệ thống",
    color: "from-gray-500 to-slate-500"
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const { logout, user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Lấy thống kê đơn hàng
  const { orderCount, isLoading } = useOrderStats();
  
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleMenu = (menuPath: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuPath]: !prev[menuPath],
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/auth/login';
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.subMenu && item.subMenu.length > 0) {
      toggleMenu(item.path);
    } else {
      router.push(item.path);
    }
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hàm để lấy badge text
  const getBadgeText = (item: typeof menuItems[0]) => {
    if (item.badge === "dynamic") {
      if (isLoading) return "...";
      return orderCount?.toString() || "0";
    }
    return item.badge;
  };

  return (
    <div className="h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-gray-300/50 dark:border-gray-600/50 shadow-2xl overflow-hidden transition-all duration-300 ease-out flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b-2 border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl border-2 border-white/20 dark:border-gray-800/20 transition-all duration-300 hover:scale-105">
            <Activity size={16} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              E-commerce Dashboard
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 sm:mt-6 relative">
          <div className="relative">
            <Search size={14} className="sm:w-4 sm:h-4 absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-50/80 dark:bg-gray-800/80 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* User Profile - Fixed */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b-2 border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="relative">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl border-2 border-white/20 dark:border-gray-800/20 transition-all duration-300 hover:scale-105">
              <span className="text-white font-medium text-xs sm:text-sm">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name || 'Admin User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || 'admin@example.com'}
            </p>
            <div className="flex items-center mt-0.5 sm:mt-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2 animate-pulse"></div>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Trực tuyến</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <nav className="p-3 sm:p-4 space-y-1">
          {filteredMenuItems.map((item) => (
            <div key={item.path} className="group">
              <button
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center space-x-2 sm:space-x-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-all duration-300 group relative overflow-hidden border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105 border-blue-400/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white hover:scale-102'
                }`}
              >
                {/* Hover effect background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg`}></div>
                
                {/* Icon with gradient background */}
                <div className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-white/20 dark:border-gray-800/20 ${
                  isActive(item.path) 
                    ? 'bg-white/20 shadow-lg' 
                    : `bg-gradient-to-br ${item.color} text-white shadow-md group-hover:shadow-lg`
                }`}>
                  <item.icon size={14} className="sm:w-4 sm:h-4" />
                </div>

                <div className="flex-1 text-left">
                  <span className="text-xs sm:text-sm font-medium">
                    {item.name}
                  </span>
                  {item.description && (
                    <p className={`text-xs mt-0.5 transition-opacity duration-300 ${
                      isActive(item.path)
                        ? 'text-white/80 opacity-100'
                        : 'text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100'
                    }`}>
                      {item.description}
                    </p>
                  )}
                </div>
                
                {/* Badge */}
                {item.badge && (
                  <span className={`px-1.5 sm:px-2 py-0.5 text-xs font-medium rounded-full transition-all duration-300 border border-white/20 dark:border-gray-800/20 ${
                    item.badge === 'Hot' 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md animate-pulse' 
                      : 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-md'
                  }`}>
                    {getBadgeText(item)}
                  </span>
                )}

                {/* Expand icon */}
                {item.subMenu && item.subMenu.length > 0 && (
                  <ChevronDown
                    size={12}
                    className={`sm:w-3.5 sm:h-3.5 transition-all duration-300 ${
                      openMenus[item.path] ? 'rotate-180' : ''
                    }`}
                  />
                )}

                {/* Active indicator */}
                {isActive(item.path) && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 sm:h-8 bg-white rounded-r-full shadow-lg"></div>
                )}
              </button>

              {/* Submenu */}
              {item.subMenu && item.subMenu.length > 0 && openMenus[item.path] && (
                <div className="ml-3 sm:ml-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-300">
                  {item.subMenu.map((subItem) => (
                    <Link
                      key={subItem.path}
                      href={subItem.path}
                      className={`block px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all duration-300 hover:scale-105 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50 ${
                        isActive(subItem.path)
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500 shadow-md'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer - Fixed */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-t-2 border-gray-200/50 dark:border-gray-700/50 space-y-1.5 sm:space-y-2 bg-gradient-to-t from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center space-x-2 sm:space-x-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:scale-102 group border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg border border-white/20 dark:border-gray-800/20 transition-all duration-300 group-hover:scale-110">
            {isDarkMode ? <Sun size={14} className="sm:w-4 sm:h-4 text-white" /> : <Moon size={14} className="sm:w-4 sm:h-4 text-white" />}
          </div>
          <span className="flex-1 text-left text-xs sm:text-sm font-medium">
            {isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 sm:space-x-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 hover:scale-102 group border border-transparent hover:border-red-200/50 dark:hover:border-red-700/50"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg border border-white/20 dark:border-gray-800/20 transition-all duration-300 group-hover:scale-110">
            <LogOut size={14} className="sm:w-4 sm:h-4 text-white" />
          </div>
          <span className="flex-1 text-left text-xs sm:text-sm font-medium">
            Đăng Xuất
          </span>
        </button>
      </div>
    </div>
  );
}