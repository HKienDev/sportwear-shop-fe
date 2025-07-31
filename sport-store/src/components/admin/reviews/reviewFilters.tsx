"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, X, Star, Package } from "lucide-react";

interface ReviewFiltersProps {
  filters: {
    rating: string;
    productSku: string;
    searchTerm: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const [searchQuery, setSearchQuery] = useState(filters.searchTerm);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery !== filters.searchTerm) {
        onFiltersChange({
          ...filters,
          searchTerm: searchQuery
        });
      }
    }, 400);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "") || searchQuery;

  return (
    <div className="relative">
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
            <div className="relative w-full sm:w-64 group">
              <select
                className={`block w-full pl-12 pr-10 py-4 border-2 rounded-xl bg-white/70 backdrop-blur-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm appearance-none transition-all duration-300 cursor-pointer ${
                  filters.rating !== "" ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                }`}
                value={filters.rating}
                onChange={e => handleFilterChange("rating", e.target.value)}
              >
                <option value="">Tất cả đánh giá</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 sao</option>
                <option value="4">⭐⭐⭐⭐ 4 sao</option>
                <option value="3">⭐⭐⭐ 3 sao</option>
                <option value="2">⭐⭐ 2 sao</option>
                <option value="1">⭐ 1 sao</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
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