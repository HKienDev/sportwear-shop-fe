"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Search, Filter, Clock, TrendingUp, Star, Eye, ShoppingBag, ImageIcon } from "lucide-react";
import { debounce } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { API_URL } from "@/utils/api";
import { useRouter } from "next/navigation";
import ErrorBoundary from "@/components/common/ErrorBoundary";

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
  }
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  productCount: number;
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
  slug: string;
  rating?: number;
  numReviews?: number;
  viewCount?: number;
  soldCount?: number;
}

interface SearchSuggestion {
  type: 'product' | 'category' | 'keyword';
  text: string;
  count?: number;
}

interface SearchFilter {
  category?: string;
  priceRange?: { min?: number; max?: number };
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
}

interface AdvancedSearchBarProps {
  categories: Category[];
}

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({ categories }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [hotKeywords, setHotKeywords] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilter>({});
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load search history and hot keywords
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
    
    // Mock hot keywords - in real app, this would come from analytics
    setHotKeywords([
      'giày bóng đá', 'áo đấu', 'quần thể thao', 'vợt tennis', 
      'bóng rổ', 'chạy bộ', 'gym', 'yoga', 'bơi lội'
    ]);
  }, []);

  // Generate search suggestions
  const generateSuggestions = useCallback((query: string): SearchSuggestion[] => {
    if (!query.trim()) return [];
    
    const suggestions: SearchSuggestion[] = [];
    
    // Category suggestions
    categories.forEach(category => {
      if (category.name.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push({
          type: 'category',
          text: category.name,
          count: category.productCount
        });
      }
    });
    
    // Keyword suggestions based on query
    const keywordSuggestions = [
      `${query} nam`, `${query} nữ`, `${query} trẻ em`,
      `${query} cao cấp`, `${query} giá rẻ`, `${query} khuyến mãi`
    ];
    
    keywordSuggestions.forEach(keyword => {
      suggestions.push({
        type: 'keyword',
        text: keyword
      });
    });
    
    return suggestions.slice(0, 8);
  }, [categories]);

  // Debounced search handler
  const debouncedHandler = useMemo(() => {
    return debounce(async (value: string) => {
      if (!value.trim()) {
        setSearchResults([]);
        setSearchSuggestions([]);
        return;
      }
      
      // Generate suggestions
      const suggestions = generateSuggestions(value);
      setSearchSuggestions(suggestions);
      
      try {
        setIsSearching(true);
        const response = await fetch(
          `${API_URL}/products/search?keyword=${encodeURIComponent(value)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.products)) {
          setSearchResults(data.products);
          
          // Track search for analytics
          trackSearch(value, data.products.length);
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
  }, [generateSuggestions]);

  // Track search for SEO and analytics
  const trackSearch = (query: string, resultCount: number) => {
    try {
      // Track in localStorage for analytics
      const searchAnalytics = JSON.parse(localStorage.getItem('searchAnalytics') || '{}');
      if (!searchAnalytics[query]) {
        searchAnalytics[query] = { count: 0, lastSearched: new Date().toISOString() };
      }
      searchAnalytics[query].count++;
      searchAnalytics[query].lastSearched = new Date().toISOString();
      localStorage.setItem('searchAnalytics', JSON.stringify(searchAnalytics));
      
      // Track in Google Analytics (if available)
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'search', {
          search_term: query,
          results_count: resultCount
        });
      }
    } catch (error) {
      console.error('Error tracking search:', error);
    }
  };

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
      setSearchSuggestions([]);
    }
    debouncedHandler(value);
  };

  const handleSearchSubmit = (query: string) => {
    if (!query.trim()) return;
    
    // Add to search history
    const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    
    // If we have search results, navigate to the first product
    if (searchResults.length > 0) {
      const firstProduct = searchResults[0];
      // Use router.push instead of window.location for better navigation
      router.push(`/user/products/details/${firstProduct._id}`);
    } else {
      // Navigate to user page with search parameter
      router.push(`/user?search=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'category') {
      // Navigate to category page
      router.push(`/user?category=${encodeURIComponent(suggestion.text)}`);
    } else {
      handleSearchSubmit(suggestion.text);
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setSearchResults([]);
        setSearchSuggestions([]);
        setShowAdvancedFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="w-full relative">
      <div className="relative group">
        <Search className="absolute left-2.5 sm:left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-hover:text-red-500 transition-colors" />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm, danh mục..."
          className="w-full px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 pl-9 sm:pl-10 md:pl-12 pr-14 sm:pr-16 md:pr-20 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white group-hover:border-red-200 text-sm sm:text-base"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchSubmit(searchQuery);
            } else if (e.key === 'Escape') {
              setSearchQuery("");
              setSearchResults([]);
              setSearchSuggestions([]);
            }
          }}
        />
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 p-1 sm:p-1.5 rounded-full hover:bg-red-50 transition-colors"
          title="Bộ lọc nâng cao"
        >
          <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hover:text-red-500" />
        </button>
      </div>

      {/* Advanced Search Dropdown - Enhanced Responsive */}
      {(searchQuery || showAdvancedFilters) && (
        <div className="absolute top-full left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 mt-1.5 sm:mt-2 z-[100] max-h-[500px] sm:max-h-[600px] overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Main Content */}
            <div className="flex-1 p-2.5 sm:p-3 md:p-4">
              {/* Search Suggestions */}
              {searchQuery && searchSuggestions.length > 0 && (
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Gợi ý tìm kiếm
                  </h3>
                  <div className="space-y-1">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-between group"
                      >
                        <span className="text-sm text-gray-700 group-hover:text-red-600 truncate">
                          {suggestion.text}
                        </span>
                        {suggestion.count && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ml-2 flex-shrink-0">
                            {suggestion.count} sản phẩm
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search History */}
              {!searchQuery && searchHistory.length > 0 && (
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Lịch sử tìm kiếm
                    </h3>
                    <button
                      onClick={clearSearchHistory}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                  <div className="space-y-1">
                    {searchHistory.slice(0, 5).map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSubmit(item)}
                        className="w-full text-left p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition-colors text-sm text-gray-700 hover:text-red-600 truncate"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Hot Keywords */}
              {!searchQuery && hotKeywords.length > 0 && (
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Từ khóa hot
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {hotKeywords.slice(0, 6).map((keyword, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSubmit(keyword)}
                        className="px-2 sm:px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full hover:bg-red-100 transition-colors"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchQuery && (isSearching || searchResults.length > 0) && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Kết quả tìm kiếm ({searchResults.length})
                  </h3>
                  {isSearching ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-red-500"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-1.5 sm:space-y-2 max-h-[250px] sm:max-h-[300px] overflow-y-auto">
                      {searchResults.map((product) => (
                        <Link
                          key={product._id}
                          href={`/user/products/details/${product._id}`}
                          className="flex items-center gap-2.5 sm:gap-3 md:gap-4 p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                          onClick={() => {
                            setSearchQuery("");
                            setSearchResults([]);
                            setSearchSuggestions([]);
                          }}
                        >
                          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex-shrink-0 overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-200">
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
                                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-red-600 transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                              {product.category?.name || "Chưa phân loại"}
                            </p>
                            <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                              <span className="text-xs sm:text-sm font-medium text-red-500">
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
                                <span className="text-xs sm:text-sm text-gray-500 line-through">
                                  {product.price.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  })}
                                </span>
                              )}
                            </div>
                            {/* Product stats */}
                            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mt-1 text-xs text-gray-400">
                              {product.rating && (
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-0.5 sm:mr-1" />
                                  {product.rating}
                                </div>
                              )}
                              {product.viewCount && (
                                <div className="flex items-center">
                                  <Eye className="w-3 h-3 mr-0.5 sm:mr-1" />
                                  {product.viewCount}
                                </div>
                              )}
                              {product.soldCount && (
                                <div className="flex items-center">
                                  <ShoppingBag className="w-3 h-3 mr-0.5 sm:mr-1" />
                                  {product.soldCount}
                                </div>
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

            {/* Advanced Filters Sidebar - Enhanced Responsive */}
            {showAdvancedFilters && (
              <div className="w-full lg:w-64 border-t lg:border-l lg:border-t-0 border-gray-100 p-2.5 sm:p-3 md:p-4 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700 mb-2.5 sm:mb-3">Bộ lọc nâng cao</h3>
                
                {/* Category Filter */}
                <div className="mb-3 sm:mb-4">
                  <label className="text-xs font-medium text-gray-600 mb-1.5 sm:mb-2 block">Danh mục</label>
                  <select
                    className="w-full text-sm border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={searchFilters.category || ''}
                    onChange={(e) => setSearchFilters({...searchFilters, category: e.target.value})}
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="mb-3 sm:mb-4">
                  <label className="text-xs font-medium text-gray-600 mb-1.5 sm:mb-2 block">Khoảng giá</label>
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <input
                      type="number"
                      placeholder="Tối thiểu"
                      className="w-full text-sm border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={searchFilters.priceRange?.min || ''}
                      onChange={(e) => setSearchFilters({
                        ...searchFilters, 
                        priceRange: {...searchFilters.priceRange, min: Number(e.target.value)}
                      })}
                    />
                    <input
                      type="number"
                      placeholder="Tối đa"
                      className="w-full text-sm border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={searchFilters.priceRange?.max || ''}
                      onChange={(e) => setSearchFilters({
                        ...searchFilters, 
                        priceRange: {...searchFilters.priceRange, max: Number(e.target.value)}
                      })}
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-3 sm:mb-4">
                  <label className="text-xs font-medium text-gray-600 mb-1.5 sm:mb-2 block">Đánh giá</label>
                  <select
                    className="w-full text-sm border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={searchFilters.rating || ''}
                    onChange={(e) => setSearchFilters({...searchFilters, rating: Number(e.target.value)})}
                  >
                    <option value="">Tất cả</option>
                    <option value="4">4 sao trở lên</option>
                    <option value="3">3 sao trở lên</option>
                    <option value="2">2 sao trở lên</option>
                  </select>
                </div>

                {/* Stock Filter */}
                <div className="mb-3 sm:mb-4">
                  <label className="flex items-center text-xs font-medium text-gray-600">
                    <input
                      type="checkbox"
                      className="mr-1.5 sm:mr-2 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      checked={searchFilters.inStock || false}
                      onChange={(e) => setSearchFilters({...searchFilters, inStock: e.target.checked})}
                    />
                    Còn hàng
                  </label>
                </div>

                {/* Sale Filter */}
                <div className="mb-3 sm:mb-4">
                  <label className="flex items-center text-xs font-medium text-gray-600">
                    <input
                      type="checkbox"
                      className="mr-1.5 sm:mr-2 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      checked={searchFilters.onSale || false}
                      onChange={(e) => setSearchFilters({...searchFilters, onSale: e.target.checked})}
                    />
                    Đang giảm giá
                  </label>
                </div>

                {/* Apply Filters Button */}
                <button
                  onClick={() => handleSearchSubmit(searchQuery)}
                  className="w-full bg-red-600 text-white text-sm py-1.5 sm:py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Áp dụng bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Wrap with ErrorBoundary
const AdvancedSearchBarWithErrorBoundary: React.FC<AdvancedSearchBarProps> = (props) => {
  return (
    <ErrorBoundary>
      <AdvancedSearchBar {...props} />
    </ErrorBoundary>
  );
};

export default AdvancedSearchBarWithErrorBoundary; 