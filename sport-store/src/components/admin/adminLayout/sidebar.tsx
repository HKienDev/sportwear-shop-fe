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
  Menu,
  X,
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      setIsMobileMenuOpen(false);
    }
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-72';
  const sidebarWidthMobile = isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full';

  // Hàm để lấy badge text
  const getBadgeText = (item: typeof menuItems[0]) => {
    if (item.badge === "dynamic") {
      if (isLoading) return "...";
      return orderCount?.toString() || "0";
    }
    return item.badge;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:scale-105 transition-all duration-200"
      >
        <Menu size={20} className="text-gray-700 dark:text-gray-300" />
      </button>

      {/* Desktop Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:block fixed top-4 left-4 z-50 p-2.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:scale-105 transition-all duration-200"
      >
        <Menu size={20} className="text-gray-700 dark:text-gray-300" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-gray-300/50 dark:border-gray-600/50 z-50 transition-all duration-300 ease-out ${sidebarWidth} ${sidebarWidthMobile} lg:translate-x-0 shadow-2xl overflow-hidden`}
      >
        {/* Header - Fixed */}
        <div className="p-6 border-b-2 border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 sticky top-0 z-10">
          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200"
          >
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>

          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl border-2 border-white/20 dark:border-gray-800/20 transition-all duration-300 hover:scale-105">
              <Activity size={20} className="text-white" />
            </div>
            {(!isCollapsed || isMobileMenuOpen) && (
              <div className="flex-1">
                <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  E-commerce Dashboard
                </p>
              </div>
            )}
          </div>

          {/* Search Bar */}
          {(!isCollapsed || isMobileMenuOpen) && (
            <div className="mt-6 relative">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 dark:bg-gray-800/80 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* User Profile - Fixed */}
        <div className="p-6 border-b-2 border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl border-2 border-white/20 dark:border-gray-800/20 transition-all duration-300 hover:scale-105">
                <span className="text-white font-medium text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            </div>
            {(!isCollapsed || isMobileMenuOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || 'admin@example.com'}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Trực tuyến</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 280px)' }}>
          <nav className="p-4 space-y-1">
            {filteredMenuItems.map((item) => (
              <div key={item.path} className="group">
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-300 group relative overflow-hidden border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105 border-blue-400/30'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white hover:scale-102'
                  }`}
                >
                  {/* Hover effect background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg`}></div>
                  
                  {/* Icon with gradient background */}
                  <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-white/20 dark:border-gray-800/20 ${
                    isActive(item.path) 
                      ? 'bg-white/20 shadow-lg' 
                      : `bg-gradient-to-br ${item.color} text-white shadow-md group-hover:shadow-lg`
                  }`}>
                    <item.icon size={16} />
                  </div>

                  {(!isCollapsed || isMobileMenuOpen) && (
                    <>
                      <div className="flex-1 text-left">
                        <span className="text-sm font-medium">
                          {item.name}
                        </span>
                        {item.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {item.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Badge */}
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full transition-all duration-300 border border-white/20 dark:border-gray-800/20 ${
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
                          size={14}
                          className={`transition-all duration-300 ${
                            openMenus[item.path] ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </>
                  )}

                  {/* Active indicator */}
                  {isActive(item.path) && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg"></div>
                  )}
                </button>

                {/* Submenu */}
                {item.subMenu && item.subMenu.length > 0 && openMenus[item.path] && (!isCollapsed || isMobileMenuOpen) && (
                  <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-300">
                    {item.subMenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        href={subItem.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50 ${
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
        <div className="p-4 border-t-2 border-gray-200/50 dark:border-gray-700/50 space-y-2 bg-gradient-to-t from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 sticky bottom-0 z-10">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:scale-102 group border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg border border-white/20 dark:border-gray-800/20 transition-all duration-300 group-hover:scale-110">
              {isDarkMode ? <Sun size={16} className="text-white" /> : <Moon size={16} className="text-white" />}
            </div>
            {(!isCollapsed || isMobileMenuOpen) && (
              <span className="flex-1 text-left text-sm font-medium">
                {isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
              </span>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 hover:scale-102 group border border-transparent hover:border-red-200/50 dark:hover:border-red-700/50"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg border border-white/20 dark:border-gray-800/20 transition-all duration-300 group-hover:scale-110">
              <LogOut size={16} className="text-white" />
            </div>
            {(!isCollapsed || isMobileMenuOpen) && (
              <span className="flex-1 text-left text-sm font-medium">
                Đăng Xuất
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}