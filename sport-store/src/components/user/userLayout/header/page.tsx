"use client";

import Link from "next/link";
import { ChevronDown, Package, Phone, Mail, MapPin, Menu, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import AuthButtons from "./authButtons/page";
import UserMenu from "./userMenu/page";
import { useAuth } from "@/context/authContext";
import { API_URL } from "@/utils/api";
import ShoppingCartButton from "./shoppingCartButton/page";
import AdvancedSearchBar from "./AdvancedSearchBar";

interface Category {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  createdBy: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  updatedBy: string;
  hasProducts: boolean;
}

const Header = () => {
  const { user } = useAuth();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mounted, setMounted] = useState(false);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      // User data available
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesUrl = `${API_URL}/categories`;
        
        const categoriesResponse = await fetch(categoriesUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!categoriesResponse.ok) {
          console.error("Categories API Error:", {
            status: categoriesResponse.status,
            statusText: categoriesResponse.statusText,
            url: categoriesUrl,
            headers: Object.fromEntries(categoriesResponse.headers.entries())
          });
          throw new Error(`HTTP error! Status: ${categoriesResponse.status}`);
        }
        const categoriesData = await categoriesResponse.json();
        
        if (isMounted && categoriesData.success && Array.isArray(categoriesData.data.categories)) {
          setCategories(categoriesData.data.categories);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    // Only fetch on client side
    if (typeof window !== 'undefined') {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!categoriesDropdownRef.current?.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Không hiển thị gì khi đang loading
  if (!mounted) {
    return (
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <a href="tel:+8434567890" className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>Hotline: 0362 195 258</span>
                </a>
                <a href="mailto:support@vjusport.com" className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>support@sportstore.com</span>
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Hệ thống cửa hàng</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div className="flex flex-col">
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 rounded mt-1"></div>
              </div>
            </div>
            <div className="flex-1 max-w-2xl mx-8">
              <div className="h-10 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <a href="tel:+8434567890" className="flex items-center text-sm hover:text-red-100 transition-colors group">
                <Phone className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                <span>Hotline: 0362 195 258</span>
              </a>
              <a href="mailto:support@vjusport.com" className="flex items-center text-sm hover:text-red-100 transition-colors group">
                <Mail className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                <span>support@sportstore.com</span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm hover:text-red-100 transition-colors group">
                <MapPin className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                <span>Hệ thống cửa hàng</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 transform transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/vju-logo-main.png"
                alt="VJU SPORT"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent group-hover:from-red-700 group-hover:to-red-900 transition-all duration-300">
                VJU SPORT
              </span>
              <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">Thể thao chuyên nghiệp</span>
            </div>
          </Link>

          {/* Advanced Search Bar */}
          <AdvancedSearchBar categories={categories} />

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {user ? <UserMenu /> : <AuthButtons />}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-t border-gray-100 relative z-10">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between">
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="py-4 text-gray-700 hover:text-red-600 transition-colors font-medium relative group"
              >
                Trang chủ
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
              <div className="relative">
                <button
                  className="flex items-center py-4 text-gray-700 hover:text-red-600 transition-colors font-medium group"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                >
                  <span className="mr-1">Danh mục sản phẩm</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Categories Dropdown Menu */}
                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 transform transition-all duration-200 ease-in-out animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <h3 className="font-medium text-gray-900">Danh mục sản phẩm</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-2">
                      {categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/categories/${category.slug}`}
                          className="flex items-center p-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-150 rounded-xl group"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 mr-3">
                            {category.image ? (
                              <Image
                                src={category.image}
                                alt={category.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                              />
                            ) : (
                              <div className="w-full h-full bg-red-50 flex items-center justify-center">
                                <Package className="w-5 h-5 text-red-600" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-gray-500">{category.productCount} sản phẩm</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Responsive: Hiển thị menu thu gọn trên mobile */}
            <div className="flex md:hidden items-center">
              <button
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Mở menu điều hướng"
              >
                <Menu className="w-7 h-7 text-gray-700" />
              </button>
            </div>
            <ShoppingCartButton aria-label="Giỏ hàng" />
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex">
          <div className="w-64 bg-white h-full shadow-xl p-6 flex flex-col animate-slideInLeft relative">
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Đóng menu điều hướng"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
            <Link href="/" className="mb-6 flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="relative w-8 h-8">
                <Image src="/vju-logo-main.png" alt="VJU SPORT" fill className="object-contain" />
              </div>
              <span className="text-lg font-bold text-red-700">VJU SPORT</span>
            </Link>
            <nav className="flex flex-col gap-4 mt-4">
              <Link href="/" className="text-gray-700 font-medium hover:text-red-600" onClick={() => setIsMobileMenuOpen(false)}>
                Trang chủ
              </Link>
              <div>
                <div className="text-gray-700 font-medium mb-2">Danh mục sản phẩm</div>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/categories/${category.slug}`}
                      className="text-gray-600 hover:text-red-600 px-2 py-1 rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}
    </header>
  );
};

export default Header;