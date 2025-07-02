"use client";

import Link from "next/link";
import { ChevronDown, Package, Menu, X } from "lucide-react";
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
  const { user, isAuthenticated } = useAuth();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mounted, setMounted] = useState(false);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log('🔍 Header - User state changed:', {
      hasUser: !!user,
      isAuthenticated,
      userRole: user?.role,
      mounted
    });
  }, [user, isAuthenticated, mounted]);

  useEffect(() => {
    if (user) {
      // User data available
      console.log('✅ Header - User data available:', {
        name: user.fullname,
        role: user.role,
        email: user.email
      });
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
                VJU SPORT
              </span>
              <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors hidden sm:block">Thể thao chuyên nghiệp</span>
            </div>
          </Link>

          {/* Advanced Search Bar - Enhanced Responsive */}
          <div className="w-full lg:w-auto lg:flex-1 lg:max-w-2xl order-3 lg:order-2 px-0 sm:px-4 lg:px-8">
            <AdvancedSearchBar categories={categories} />
          </div>

          {/* Auth Buttons - Enhanced Responsive */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-4 order-2 lg:order-3">
            {(() => {
              console.log('🔍 Header - Render decision:', {
                hasUser: !!user,
                isAuthenticated,
                willRenderUserMenu: !!user,
                willRenderAuthButtons: !user
              });
              return user ? <UserMenu /> : <AuthButtons />;
            })()}
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
              <div className="relative" ref={categoriesDropdownRef}>
                <button
                  className="flex items-center py-2.5 sm:py-3 lg:py-4 text-gray-700 hover:text-red-600 transition-colors font-medium group text-sm lg:text-base"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                >
                  <span className="mr-1">Danh mục sản phẩm</span>
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Categories Dropdown Menu - Enhanced Responsive */}
                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 w-64 sm:w-72 lg:w-80 xl:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 transform transition-all duration-200 ease-in-out animate-fadeIn">
                    <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
                      <h3 className="font-medium text-gray-900 text-sm lg:text-base">Danh mục sản phẩm</h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 sm:gap-2 p-2 max-h-80 sm:max-h-96 overflow-y-auto">
                      {categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/categories/${category.slug}`}
                          className="flex items-center p-2 sm:p-2 lg:p-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-150 rounded-xl group"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg overflow-hidden flex-shrink-0 mr-2 lg:mr-3">
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
                                <Package className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-red-600" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-xs sm:text-sm lg:text-base truncate">{category.name}</p>
                            <p className="text-xs lg:text-sm text-gray-500">{category.productCount} sản phẩm</p>
                          </div>
                        </Link>
                      ))}
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
              
              {/* Mobile Categories */}
              <div className="border-t border-gray-100 pt-3 sm:pt-4">
                <div className="text-gray-700 font-medium mb-2 sm:mb-3 px-3 text-sm sm:text-base">Danh mục sản phẩm</div>
                <div className="flex flex-col gap-1 max-h-48 sm:max-h-60 overflow-y-auto pr-2">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/categories/${category.slug}`}
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