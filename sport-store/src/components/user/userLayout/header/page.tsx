"use client";

import Link from "next/link";

import { Search, ChevronDown, Package, Phone, Mail, MapPin, ImageIcon, Menu, X } from "lucide-react";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { debounce } from "lodash";
import Image from "next/image";
import AuthButtons from "./authButtons/page";
import UserMenu from "./userMenu/page";
import { useAuth } from "@/context/authContext";
import { API_URL } from "@/utils/api";
import ShoppingCartButton from "./shoppingCartButton/page";

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

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  category: Category;
  images: {
    main: string;
    sub?: string[];
  };
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

const Header = () => {
  const { user } = useAuth();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("User data in header:", {
        name: user.name,
        email: user.email,
        role: user.role
      });
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (typeof window === "undefined") return;

        // Fetch categories
        const categoriesUrl = `${API_URL}/categories`;
        console.log("Fetching categories from:", categoriesUrl);
        
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
        console.log("Categories data:", categoriesData);
        
        if (isMounted && categoriesData.success && Array.isArray(categoriesData.data.categories)) {
          setCategories(categoriesData.data.categories);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const debouncedHandler = useMemo(() => {
    return debounce(async (value: string) => {
      if (!value.trim()) {
        setSearchResults([]);
        return;
      }
      
      try {
        setIsSearching(true);
        const response = await fetch(
          `${API_URL}/products/search?keyword=${encodeURIComponent(value)}`
        );
        if (!response.ok) {
          console.error("Search API Error:", {
            status: response.status,
            statusText: response.statusText,
            url: response.url
          });
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Search results:", data);
        if (data.success && Array.isArray(data.products)) {
          setSearchResults(data.products);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncedHandler.cancel();
    };
  }, [debouncedHandler]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchResults([]);
    }
    debouncedHandler(value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setSearchResults([]);
        setSearchQuery("");
      }
      if (!categoriesDropdownRef.current?.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                src="/Logo_vju.png"
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

          {/* Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-2xl mx-8 relative">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-red-500 transition-colors" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2.5 pl-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white group-hover:border-red-200"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchQuery("");
                    setSearchResults([]);
                  }
                }}
              />
            </div>

            {/* Search Results */}
            {searchQuery && (isSearching || searchResults.length > 0) && (
              <div className="absolute top-full left-0 w-full bg-white rounded-xl shadow-2xl p-4 mt-2 border border-gray-100 animate-fadeIn z-[100]">
                {isSearching ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product._id}
                        href={`/product/${product.slug}`}
                        className="flex items-center gap-4 p-2 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                      >
                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-200">
                          {product.images?.main ? (
                            <Image
                              src={product.images.main}
                              alt={product.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-red-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {product.category?.name || "Chưa phân loại"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-medium text-red-500">
                              {product.discountPrice
                                ? product.discountPrice.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  })
                                : product.price.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  })}
                            </span>
                            {product.discountPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                {product.price.toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Không tìm thấy sản phẩm nào
                  </div>
                )}
              </div>
            )}
          </div>

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
                <Image src="/Logo_vju.png" alt="VJU SPORT" fill className="object-contain" />
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