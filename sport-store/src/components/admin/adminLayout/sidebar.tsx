"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { logout } from "@/lib/api";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ClipboardList, 
  Settings,
  LogOut 
} from "lucide-react";

const menuItems = [
  { name: "Trang Chủ", path: "/admin", icon: LayoutDashboard, subMenu: [] },
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

  // Toggle menu con
  const toggleMenu = (menuPath: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuPath]: !prev[menuPath],
    }));
  };

  return (
    <div className="w-64 bg-[#FAFAFA] border-r border-gray-200 h-screen fixed left-0 top-0 p-4 flex flex-col">
      {/* Logo + Gạch dưới */}
      <div className="text-lg font-bold text-center pb-3 border-b border-gray-300">
        VJU SPORT
      </div>

      <ul className="mt-4 flex-grow">
        {menuItems.map((item) => {
          const isActive =
            (item.path === "/admin" && pathname === "/admin") ||
            (item.path !== "/admin" && pathname.startsWith(item.path)) ||
            item.subMenu.some((sub) => pathname === sub.path);

          const isOpen = openMenus[item.path] || item.subMenu.some((sub) => pathname === sub.path);
          const Icon = item.icon;

          return (
            <li key={item.path} className="mb-2">
              {item.path === "logout" ? (
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 rounded-md font-medium bg-red-500 text-white hover:bg-red-600 transition-all flex items-center gap-2"
                >
                  <Icon size={20} />
                  {item.name}
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
                  className={`flex justify-between items-center px-4 py-3 rounded-md transition-all font-medium cursor-pointer ${
                    isActive && !isOpen ? "bg-[#4EB09D] text-white" : "text-[#858594] hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={20} />
                    {item.name}
                  </div>
                  {item.subMenu.length > 0 && (
                    <span className="ml-2 transition-transform duration-300">
                      {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                    </span>
                  )}
                </div>
              )}

              {/* Menu con */}
              {isOpen && item.subMenu.length > 0 && (
                <ul className="pl-4 mt-2 transition-all duration-300">
                  {item.subMenu.map((subItem) => {
                    const isSubActive = pathname === subItem.path;
                    return (
                      <li key={subItem.path} className="mb-1">
                        <Link
                          href={subItem.path}
                          className={`block px-4 py-2 rounded-md transition-all font-medium ${
                            isSubActive ? "bg-[#4EB09D] text-white" : "text-[#858594] hover:bg-gray-100"
                          }`}
                        >
                          {subItem.name}
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