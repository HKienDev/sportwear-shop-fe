"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, Star, Package, ChevronDown, Check } from "lucide-react";

interface ReviewFiltersProps {
  filters: {
    rating: string;
    productSku: string;
    searchTerm: string;
  };
  onFiltersChange: (filters: {
    rating: string;
    productSku: string;
    searchTerm: string;
  }) => void;
  onClearFilters: () => void;
}

const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const [searchQuery, setSearchQuery] = useState(filters.searchTerm);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false);
  const ratingDropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const debouncedFiltersChange = useCallback(
    (newFilters: typeof filters) => {
      onFiltersChange(newFilters);
    },
    [onFiltersChange]
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery !== filters.searchTerm) {
        debouncedFiltersChange({
          ...filters,
          searchTerm: searchQuery
        });
      }
    }, 400);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters, debouncedFiltersChange]);

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleRatingSelect = (rating: string) => {
    handleFilterChange("rating", rating);
    setIsRatingDropdownOpen(false);
  };

  const updateDropdownPosition = () => {
    if (ratingDropdownRef.current) {
      const rect = ratingDropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const handleDropdownToggle = () => {
    if (!isRatingDropdownOpen) {
      updateDropdownPosition();
    }
    setIsRatingDropdownOpen(!isRatingDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ratingDropdownRef.current && !ratingDropdownRef.current.contains(event.target as Node)) {
        setIsRatingDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Force re-render when dropdown opens to ensure proper positioning
  useEffect(() => {
    if (isRatingDropdownOpen) {
      updateDropdownPosition();
    }
  }, [isRatingDropdownOpen]);



  const clearFilters = () => {
    setSearchQuery("");
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "") || searchQuery;

  return (
    <div className="relative" style={{ position: 'relative', zIndex: 9999999 }}>
      {/* Glass Morphism Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-emerald-600/10 rounded-3xl transform -rotate-2"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-indigo-600/10 rounded-3xl transform rotate-2"></div>
      {/* Main Container */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-indigo-100/60 shadow-xl p-8 mb-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Search Section */}
          <div className="flex-1 w-full lg:max-w-xl group">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề, nội dung, tên sản phẩm..."
                className={`block w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-white/70 backdrop-blur-sm placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all duration-300 ${
                  isSearchFocused ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-slate-200 hover:border-slate-300'
                }`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              {searchQuery && (
                <button 
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          {/* Rating Filter */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-64 group" ref={ratingDropdownRef} style={{ position: 'relative', zIndex: 9999999 }}>
              <div className="relative">
                {/* Custom Select Button */}
                <button
                  type="button"
                  className={`relative w-full pl-12 pr-10 py-4 border-2 rounded-xl bg-white/70 backdrop-blur-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all duration-300 cursor-pointer group-hover:shadow-lg ${
                    filters.rating !== "" ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={handleDropdownToggle}
                >
                  {/* Star Icon */}
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <Star className={`h-4 w-4 transition-colors duration-200 ${
                      filters.rating !== "" ? 'text-emerald-500' : 'text-slate-400'
                    }`} />
                  </div>
                  
                  {/* Display Text */}
                  <div className="text-left">
                    {filters.rating === "" ? "Tất cả đánh giá" :
                     filters.rating === "5" ? "⭐⭐⭐⭐⭐ 5 sao" :
                     filters.rating === "4" ? "⭐⭐⭐⭐ 4 sao" :
                     filters.rating === "3" ? "⭐⭐⭐ 3 sao" :
                     filters.rating === "2" ? "⭐⭐ 2 sao" :
                     filters.rating === "1" ? "⭐ 1 sao" : "Tất cả đánh giá"}
                  </div>
                  
                  {/* Custom Chevron Icon */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <div className="relative">
                      <ChevronDown className={`h-4 w-4 transition-all duration-200 ${
                        isRatingDropdownOpen ? 'rotate-180' : ''
                      } ${filters.rating !== "" ? 'text-emerald-500' : 'text-slate-400'}`} />
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-emerald-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </div>
                  </div>
                </button>
                
                {/* Custom Dropdown Menu */}
                {isRatingDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border-2 border-emerald-200 rounded-xl shadow-xl overflow-hidden" style={{ zIndex: 9999999 }}>
                    <div className="py-2">
                      <button
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-emerald-50 transition-colors duration-200 flex items-center ${
                          filters.rating === "" ? 'bg-blue-500 text-white' : 'text-slate-700'
                        }`}
                        onClick={() => handleRatingSelect("")}
                      >
                        {filters.rating === "" && <Check className="h-4 w-4 mr-2 text-white" />}
                        <Star className={`h-4 w-4 mr-2 ${filters.rating === "" ? 'text-white' : 'text-emerald-500'}`} />
                        Tất cả đánh giá
                      </button>
                      <button
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-emerald-50 transition-colors duration-200 flex items-center ${
                          filters.rating === "5" ? 'bg-blue-500 text-white' : 'text-slate-700'
                        }`}
                        onClick={() => handleRatingSelect("5")}
                      >
                        {filters.rating === "5" && <Check className="h-4 w-4 mr-2 text-white" />}
                        <span className="mr-2">⭐⭐⭐⭐⭐</span>
                        5 sao
                      </button>
                      <button
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-emerald-50 transition-colors duration-200 flex items-center ${
                          filters.rating === "4" ? 'bg-blue-500 text-white' : 'text-slate-700'
                        }`}
                        onClick={() => handleRatingSelect("4")}
                      >
                        {filters.rating === "4" && <Check className="h-4 w-4 mr-2 text-white" />}
                        <span className="mr-2">⭐⭐⭐⭐</span>
                        4 sao
                      </button>
                      <button
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-emerald-50 transition-colors duration-200 flex items-center ${
                          filters.rating === "3" ? 'bg-blue-500 text-white' : 'text-slate-700'
                        }`}
                        onClick={() => handleRatingSelect("3")}
                      >
                        {filters.rating === "3" && <Check className="h-4 w-4 mr-2 text-white" />}
                        <span className="mr-2">⭐⭐⭐</span>
                        3 sao
                      </button>
                      <button
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-emerald-50 transition-colors duration-200 flex items-center ${
                          filters.rating === "2" ? 'bg-blue-500 text-white' : 'text-slate-700'
                        }`}
                        onClick={() => handleRatingSelect("2")}
                      >
                        {filters.rating === "2" && <Check className="h-4 w-4 mr-2 text-white" />}
                        <span className="mr-2">⭐⭐</span>
                        2 sao
                      </button>
                      <button
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-emerald-50 transition-colors duration-200 flex items-center ${
                          filters.rating === "1" ? 'bg-blue-500 text-white' : 'text-slate-700'
                        }`}
                        onClick={() => handleRatingSelect("1")}
                      >
                        {filters.rating === "1" && <Check className="h-4 w-4 mr-2 text-white" />}
                        <span className="mr-2">⭐</span>
                        1 sao
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Floating Label Effect */}
                {filters.rating !== "" && (
                  <div className="absolute -top-2 left-4 px-2 bg-white text-xs font-medium text-emerald-600 transition-all duration-200">
                    Đánh giá
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div 
            className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-200/60"
            style={{
              animation: "slideInFromTop 0.4s ease-out forwards"
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-600">Bộ lọc đang áp dụng:</span>
            </div>
            {searchQuery && (
              <div className="inline-flex items-center bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 text-sm rounded-full px-4 py-2 border border-indigo-200/60 shadow-sm">
                <Search size={14} className="mr-2" />
                <span className="mr-2">&quot;{searchQuery}&quot;</span>
                <button 
                  className="ml-1 p-1 rounded-full hover:bg-indigo-200/60 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {filters.rating !== "" && (
              <div className="inline-flex items-center bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 text-sm rounded-full px-4 py-2 border border-emerald-200/60 shadow-sm">
                <Star size={14} className="mr-2" />
                <span className="mr-2">
                  {filters.rating === "5" ? "⭐⭐⭐⭐⭐ 5 sao" :
                   filters.rating === "4" ? "⭐⭐⭐⭐ 4 sao" :
                   filters.rating === "3" ? "⭐⭐⭐ 3 sao" :
                   filters.rating === "2" ? "⭐⭐ 2 sao" :
                   filters.rating === "1" ? "⭐ 1 sao" : filters.rating}
                </span>
                <button 
                  className="ml-1 p-1 rounded-full hover:bg-emerald-200/60 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" 
                  onClick={() => handleFilterChange("rating", "")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {filters.productSku && (
              <div className="inline-flex items-center bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 text-sm rounded-full px-4 py-2 border border-purple-200/60 shadow-sm">
                <Package size={14} className="mr-2" />
                <span className="mr-2">SKU: {filters.productSku}</span>
                <button 
                  className="ml-1 p-1 rounded-full hover:bg-purple-200/60 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20" 
                  onClick={() => handleFilterChange("productSku", "")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <button 
              className="text-sm text-slate-500 font-medium ml-auto hover:text-slate-700 transition-colors duration-200 flex items-center gap-1"
              onClick={clearFilters}
            >
              <X className="h-3.5 w-3.5" />
              Xóa tất cả
            </button>
          </div>
        )}
        <style>{`
          @keyframes slideInFromTop {
            0% {
              transform: translateY(-10px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ReviewFilters; 