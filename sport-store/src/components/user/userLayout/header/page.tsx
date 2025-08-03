"use client";

import Link from "next/link";
import { Package, Menu, X } from "lucide-react";
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
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        // Debounce API calls
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          const categoriesUrl = `${API_URL}/categories`;
          
          const categoriesResponse = await fetch(categoriesUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Cache-Control': 'max-age=300' // Cache for 5 minutes
            }
          });

          if (!categoriesResponse.ok) {
            console.error("Categories API Error:", {
              status: categoriesResponse.status,
              statusText: categoriesResponse.statusText,
              url: categoriesUrl
            });
            throw new Error(`HTTP error! Status: ${categoriesResponse.status}`);
          }
          
          const categoriesData = await categoriesResponse.json();
          
          if (isMounted && categoriesData.success && Array.isArray(categoriesData.data.categories)) {
            setCategories(categoriesData.data.categories);
          }
        }, 100); // Debounce 100ms
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    // Only fetch on client side with error handling
    if (typeof window !== 'undefined') {
      fetchData();
    }

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
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
      {/* Main Header - Enhanced Responsive */}
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 lg:py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-3 sm:space-y-4 lg:space-y-0">
          {/* Logo - Enhanced Responsive */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group order-1 lg:order-1">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 transform transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/vju-logo-main.png"
                alt="VJU SPORT"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent group-hover:from-red-700 group-hover:to-red-900 transition-all duration-300">
                KHÁNH HOÀN SHOP
              </span>
              <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors hidden sm:block">Thời trang nam & thể thao – Phong cách năng động</span>
            </div>
          </Link>

          {/* Advanced Search Bar - Enhanced Responsive */}
          <div className="w-full lg:w-auto lg:flex-1 lg:max-w-2xl order-3 lg:order-2 px-0 sm:px-4 lg:px-8">
            <AdvancedSearchBar categories={categories} />
          </div>

          {/* Auth Buttons - Enhanced Responsive */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-4 order-2 lg:order-3">
            {user ? <UserMenu /> : <AuthButtons />}
          </div>
        </div>
      </div>

      {/* Navigation Bar - Enhanced Responsive */}
      <div className="border-t border-gray-100 relative z-10">
        <div className="container mx-auto px-3 sm:px-4">
          <nav className="flex items-center justify-between">
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
              <Link
                href="/"
                className="py-2.5 sm:py-3 lg:py-4 text-gray-700 hover:text-red-600 transition-colors font-medium relative group text-sm lg:text-base"
              >
                Trang chủ
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
              
              <Link
                href="/promotions"
                className="py-2.5 sm:py-3 lg:py-4 text-gray-700 hover:text-red-600 transition-colors font-medium relative group text-sm lg:text-base"
              >
                Khuyến mãi
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
              
              <Link
                href="/brands"
                className="py-2.5 sm:py-3 lg:py-4 text-gray-700 hover:text-red-600 transition-colors font-medium relative group text-sm lg:text-base"
              >
                Thương hiệu
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
              
              <Link
                href="/contact"
                className="py-2.5 sm:py-3 lg:py-4 text-gray-700 hover:text-red-600 transition-colors font-medium relative group text-sm lg:text-base"
              >
                Liên hệ
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
              <div 
                className="relative" 
                ref={categoriesDropdownRef}
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
              >
                <button
                  className="flex items-center py-2.5 sm:py-3 lg:py-4 text-gray-700 hover:text-red-600 transition-colors font-medium group text-sm lg:text-base relative"
                >
                  <span>Danh mục sản phẩm</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </button>

                {/* Categories Dropdown Menu - E-commerce 2025+ Design */}
                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 w-80 sm:w-96 lg:w-[500px] xl:w-[600px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-4 z-50 transform transition-all duration-300 ease-out animate-fadeIn">

                    
                    {/* Categories Grid - Modern Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                      {categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/user/products?category=${category.slug}`}
                          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white hover:from-red-50 hover:to-red-100/50 transition-all duration-300 border border-gray-100 hover:border-red-200 hover:shadow-lg hover:shadow-red-100/50"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          <div className="p-4 flex items-center space-x-4">
                            {/* Category Image with Modern Frame */}
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-red-100 group-hover:to-red-200 transition-all duration-300 flex-shrink-0">
                              {category.image ? (
                                <Image
                                  src={category.image}
                                  alt={category.name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      const fallback = document.createElement('div');
                                      fallback.className = 'w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center';
                                      fallback.innerHTML = '<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>';
                                      parent.appendChild(fallback);
                                    }
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                                  <Package className="w-5 h-5 text-red-600" />
                                </div>
                              )}
                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            
                            {/* Category Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors duration-200 text-sm lg:text-base truncate">
                                {category.name}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-500 group-hover:text-red-600 transition-colors duration-200">
                                  {category.productCount} sản phẩm
                                </span>
                                <div className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-red-400 transition-colors duration-200"></div>
                                <span className="text-xs text-gray-400 group-hover:text-red-500 transition-colors duration-200">
                                  Khám phá ngay
                                </span>
                              </div>
                            </div>
                            
                            {/* Arrow Icon */}
                            <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                              <svg className="w-3 h-3 text-gray-400 group-hover:text-red-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                          
                          {/* Hover Border Effect */}
                          <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-red-200/50 transition-all duration-300"></div>
                        </Link>
                      ))}
                    </div>
                    
                    {/* Footer with CTA */}
                    <div className="px-6 py-3 border-t border-gray-100/50 bg-gradient-to-r from-gray-50/50 to-white/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Tổng cộng {categories.length} danh mục</span>
                        <Link 
                          href="/categories" 
                          className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors duration-200"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          Xem tất cả →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile Menu Button - Enhanced */}
            <div className="flex md:hidden items-center">
              <button
                className="p-1.5 sm:p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Mở menu điều hướng"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
            </div>
            
            {/* Shopping Cart Button */}
            <ShoppingCartButton aria-label="Giỏ hàng" />
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu - Enhanced Responsive */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex">
          <div className="w-72 sm:w-80 md:w-96 bg-white h-full shadow-xl p-3 sm:p-4 md:p-6 flex flex-col animate-slideInLeft relative overflow-y-auto">
            <button
              className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Đóng menu điều hướng"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
            
            {/* Mobile Logo */}
            <Link href="/" className="mb-4 sm:mb-6 flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="relative w-7 h-7 sm:w-8 sm:h-8">
                <Image src="/vju-logo-main.png" alt="VJU SPORT" fill className="object-contain" />
              </div>
              <span className="text-base sm:text-lg font-bold text-red-700">VJU SPORT</span>
            </Link>
            
            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-2 sm:gap-4 mt-2 sm:mt-4 flex-1">
              <Link 
                href="/" 
                className="text-gray-700 font-medium hover:text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors text-sm sm:text-base" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              
              <Link 
                href="/promotions" 
                className="text-gray-700 font-medium hover:text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors text-sm sm:text-base" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Khuyến mãi
              </Link>
              
              <Link 
                href="/brands" 
                className="text-gray-700 font-medium hover:text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors text-sm sm:text-base" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Thương hiệu
              </Link>
              
              <Link 
                href="/contact" 
                className="text-gray-700 font-medium hover:text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors text-sm sm:text-base" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Liên hệ
              </Link>
              
              {/* Mobile Categories */}
              <div className="border-t border-gray-100 pt-3 sm:pt-4">
                <div className="text-gray-700 font-medium mb-2 sm:mb-3 px-3 text-sm sm:text-base">Danh mục sản phẩm</div>
                <div className="flex flex-col gap-1 max-h-48 sm:max-h-60 overflow-y-auto pr-2">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/user/products?category=${category.slug}`}
                      className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2 sm:space-x-3"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden flex-shrink-0">
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = document.createElement('div');
                                fallback.className = 'w-full h-full bg-red-50 flex items-center justify-center';
                                fallback.innerHTML = '<svg class="w-3 h-3 sm:w-4 sm:h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>';
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-red-50 flex items-center justify-center">
                            <Package className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{category.name}</p>
                        <p className="text-xs text-gray-500">{category.productCount} sản phẩm</p>
                      </div>
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