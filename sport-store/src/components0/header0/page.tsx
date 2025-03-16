"use client";

import Link from "next/link";
import { Search, Phone, Menu } from "lucide-react";
import React, { useState, useEffect, useMemo, useRef } from "react";
import debounce from "lodash/debounce";
import Image from "next/image";
import ContactInfo from "./ContactInfo/page";
import ShoppingCartButton from "./ShoppingCartButton/page";
import AuthButtons from "./AuthButtons/page";
import { useAuth } from "@/app/context/authContext";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        if (typeof window === "undefined") return;
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
      isMounted = false;
    };
  }, []);

  const debouncedHandler = useMemo(() => {
    return debounce((value: string) => {
      setDebouncedSearch(value);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncedHandler.cancel();
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
      if (!searchRef.current?.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white py-3 px-4 border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between flex-wrap md:flex-nowrap">
        {/* Mobile menu button */}
        <button 
          className="block md:hidden text-gray-700" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo + Danh mục */}
        <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-start">
          <Link href="/" className="text-2xl font-bold text-black">
            VJU SPORT
          </Link>
          <button className="hidden md:block bg-red-500 text-white text-lg font-semibold px-4 py-2 rounded-xl shadow-md">
            Danh mục
          </button>
        </div>

        {/* Ô tìm kiếm */}
        <div ref={searchRef} className="relative w-full md:w-96 mt-3 md:mt-0">
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
        <div className="hidden md:flex items-center gap-6 md:gap-12">
          <ShoppingCartButton />
          <ContactInfo icon={Phone} text="Gọi mua hàng" subtext="1800.0244" />
        </div>

        {/* User */}
        <div className="flex items-center gap-4 md:gap-6">
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-gray-700 text-sm">{user.name}</span>
              {typeof window !== "undefined" && user.avatar ? (
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

      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 bg-white shadow-lg p-4 border rounded-lg">
          <button className="block w-full text-left py-2 px-4 bg-red-500 text-white rounded-md">
            Danh mục
          </button>
          <div className="flex flex-col mt-3 gap-3">
            <ShoppingCartButton />
            <ContactInfo icon={Phone} text="Gọi mua hàng" subtext="1800.0244" />
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-gray-700">{user.name}</span>
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
      )}
    </header>
  );
};

export default Header;