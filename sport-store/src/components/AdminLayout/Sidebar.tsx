"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
  {
    name: "Trang chủ",
    path: "/admin/dashboard",
    subMenu: [],
  },
  {
    name: "Đơn Hàng",
    path: "/admin/orders",
    subMenu: [
      { name: "Danh Sách Đơn Hàng", path: "/admin/orders/list" },
      { name: "Thêm Đơn Hàng", path: "/admin/orders/add" },
      { name: "Chi Tiết Đơn Hàng", path: "/admin/orders/details" },
    ],
  },
  {
    name: "Sản phẩm",
    path: "/admin/products",
    subMenu: [],
  },
  {
    name: "Người dùng",
    path: "/admin/users",
    subMenu: [],
  },
  {
    name: "Tin nhắn",
    path: "/admin/messages",
    subMenu: [],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (menuPath: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuPath]: !prev[menuPath],
    }));
  };

  return (
    <div className="w-[720] bg-white border-r border-gray-200 min-h-screen p-4">
      <h1 className="text-lg font-bold mb-4">VJU SPORT</h1>
      <ul>
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const isOpen = openMenus[item.path];

          return (
            <li key={item.path} className="mb-2">
              {/* Mục chính (Click để mở menu con nếu có) */}
              <div
                onClick={() => item.subMenu.length > 0 && toggleMenu(item.path)}
                className={`px-4 py-3 rounded-md transition-all font-medium cursor-pointer ${
                  isActive ? "bg-[#4EB09D] text-white" : "text-[#858594] hover:bg-gray-100"
                }`}
              >
                {item.name}
              </div>

              {/* Menu con nếu được mở */}
              {isOpen && item.subMenu.length > 0 && (
                <ul className="pl-4 mt-2">
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