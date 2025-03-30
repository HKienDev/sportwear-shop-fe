"use client";

import { useCart } from "@/app/context/cartContext";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const ShoppingCartButton = () => {
  const { items } = useCart();
  const itemCount = items.length;

  return (
    <Link
      href="/user/cart"
      className="group relative inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
    >
      {/* Icon giỏ hàng với hiệu ứng hover */}
      <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors duration-300" />
      
      {/* Badge hiển thị số lượng sản phẩm */}
      {itemCount > 0 && (
        <div className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-medium rounded-full shadow-sm group-hover:shadow-md transition-all duration-300">
          {itemCount}
        </div>
      )}

      {/* Tooltip khi hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap">
        Giỏ hàng
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>

      {/* Hiệu ứng ripple khi click */}
      <div className="absolute inset-0 rounded-lg bg-purple-500/0 group-hover:bg-purple-500/5 transition-all duration-300"></div>
    </Link>
  );
};

export default ShoppingCartButton;