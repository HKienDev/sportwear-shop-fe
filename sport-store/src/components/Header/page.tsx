"use client";

import Link from "next/link";
import { Search, Phone } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";
import Image from "next/image";
import ContactInfo from "./ContactInfo/page";
import ShoppingCartButton from "./ShoppingCartButton/page";
import AuthButtons from "./AuthButtons/page";
import { useAuth } from "@/app/context/AuthContext";

interface Product {
  id: number;
  title: string;
  price: number;
  salePrice?: number;
  category: string;
}
const Header = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url =
          "https://676383e717ec5852cae91a1b.mockapi.io/sports-shop/api/v1/Products";
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        setProducts(await response.json());
      } catch (error) {
        console.error(
          "Lỗi khi lấy sản phẩm:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    };
    fetchProducts();
  }, []);

  const debouncedHandler = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 300),
    []
  );

  useEffect(() => {
    debouncedHandler(searchTerm);
    return () => debouncedHandler.cancel();
  }, [searchTerm, debouncedHandler]);

  const filteredProducts = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
  
    return products.filter((product) => {
      const title = product.title ? product.title.toLowerCase() : "";
      const category = product.category ? product.category.toLowerCase() : "";
  
      return (
        title.includes(debouncedSearch.toLowerCase()) ||
        category.includes(debouncedSearch.toLowerCase())
      );
    });
  }, [debouncedSearch, products]);

  return (
    <header className="bg-white py-4 px-6 border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between flex-wrap lg:flex-nowrap">
        {/* Logo + Danh mục */}
        <div className="flex items-center gap-4 lg:gap-8 w-full lg:w-auto">
          <Link href="/" className="text-2xl font-bold text-black">
            VJU SPORT
          </Link>
          <button className="bg-red-500 text-white text-lg font-semibold px-4 py-2 rounded-xl shadow-md">
            Danh mục
          </button>
        </div>

        {/* Ô tìm kiếm */}
        <div className="relative w-full lg:w-96">
          <input
            type="text"
            placeholder="Bạn cần tìm gì?"
            className="pl-12 pr-4 py-3 border rounded-full w-full text-lg bg-gray-100 text-gray-600 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
          {filteredProducts.length > 0 && (
            <ul className="absolute w-full bg-white border rounded-lg mt-2 shadow-lg">
              {filteredProducts.map((product) => (
                <li key={product.id} className="p-2 hover:bg-gray-100 cursor-pointer">
                  {product.title} - {product.salePrice || product.price} VND
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Giỏ hàng + Thông tin liên hệ */}
        <div className="flex items-center gap-6 lg:gap-12 flex-wrap justify-center lg:justify-end">
          <ShoppingCartButton />
          <ContactInfo icon={Phone} text="Gọi mua hàng" subtext="1800.0244" />
        </div>

        {/* User */}
        <div className="flex items-center gap-4 lg:gap-6">
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-gray-700 text-sm">{user.name}</span>
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  ❔
                </div>
              )}
            </div>
          )}
          <AuthButtons />
        </div>
      </div>
    </header>
  );
};

export default Header;