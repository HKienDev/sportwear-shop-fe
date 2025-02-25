"use client";

import Link from "next/link";
import { Search, Phone } from "lucide-react";
import React, { useState, useEffect, useMemo, useRef } from "react";
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
  name: string;
}

const Header = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true; // Tránh update state nếu component bị unmount

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://676383e717ec5852cae91a1b.mockapi.io/sports-shop/api/v1/Products"
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (isMounted && Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false; // Cleanup khi unmount
    };
  }, []);

  const debouncedHandler = useMemo(() => {
    return debounce((value: string) => {
      setDebouncedSearch(value);
    }, 300);
  }, [setDebouncedSearch]);

  useEffect(() => {
    return () => {
      debouncedHandler.cancel(); // Cleanup debounce khi component unmount
    };
  }, [debouncedHandler]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedHandler(e.target.value);
    setShowResults(true);
  };

  const filteredProducts = useMemo(() => {
    if (!debouncedSearch.trim() || products.length === 0) return [];
    return products.filter((product) =>
      product.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="bg-white py-4 px-6 border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between flex-wrap lg:flex-nowrap">
        {/* Logo + Danh mục */}
        <div className="flex items-center gap-4 lg:gap-8 w-full lg:w-auto">
          <Link href="/" className="text-2xl font-bold text-black">VJU SPORT</Link>
          <button className="bg-red-500 text-white text-lg font-semibold px-4 py-2 rounded-xl shadow-md">
            Danh mục
          </button>
        </div>

        {/* Ô tìm kiếm */}
        <div ref={searchRef} className="relative w-full lg:w-96">
          <input
            type="text"
            placeholder="Bạn cần tìm gì?"
            className="pl-12 pr-4 py-3 border rounded-full w-full text-lg bg-gray-100 text-gray-600 shadow-inner"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />

          {showResults && filteredProducts.length > 0 && (
            <ul className="absolute w-full bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-50 max-h-60 overflow-auto">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    window.location.href = `/product/${product.id}`;
                    setShowResults(false);
                  }}
                >
                  <span>{product.name}</span>
                  <span className="text-red-500 font-semibold">
                    {product.salePrice || product.price} VND
                  </span>
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