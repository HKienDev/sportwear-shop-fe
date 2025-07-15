"use client";

import React, { useCallback, useState, useEffect } from "react";
import { Search, Filter, Plus } from "lucide-react";

// Các hằng số cho trạng thái coupon
export const COUPON_STATUS = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Tạm Dừng",
  EXPIRED: "Hết hạn",
  UPCOMING: "Sắp diễn ra",
} as const;

// Hàm lấy màu sắc cho trạng thái
export function getCouponStatusColor(status: string): string {
  switch (status) {
    case COUPON_STATUS.ACTIVE:
      return "text-green-500 bg-green-50 border border-green-200";
    case COUPON_STATUS.INACTIVE:
      return "text-amber-500 bg-amber-50 border border-amber-200";
    case COUPON_STATUS.EXPIRED:
      return "text-red-500 bg-red-50 border border-red-200";
    default:
      return "text-gray-500 bg-gray-50 border border-gray-200";
  }
}

// Hàm lấy text hiển thị cho trạng thái
export function getCouponStatusText(status: string): string {
  return status;
}

interface CouponFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onAddCoupon: () => void;
}

const CouponFilter = React.memo(
  ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    onAddCoupon,
  }: CouponFilterProps) => {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Debounce cho input tìm kiếm
    useEffect(() => {
      const handler = setTimeout(() => {
        if (localSearchTerm !== searchTerm) {
          onSearchChange(localSearchTerm);
        }
      }, 500);

      return () => clearTimeout(handler);
    }, [localSearchTerm, searchTerm, onSearchChange]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearchTerm(e.target.value);
    }, []);

    const handleStatusFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
      onStatusFilterChange(e.target.value);
    }, [onStatusFilterChange]);

    const clearAllFilters = useCallback(() => {
      setLocalSearchTerm("");
      onSearchChange("");
      onStatusFilterChange("");
    }, [onSearchChange, onStatusFilterChange]);

    const hasActiveFilters = localSearchTerm || statusFilter;

    return (
      <div className="relative">
        {/* Glass Morphism Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-emerald-600/10 rounded-3xl transform -rotate-2"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-indigo-600/10 rounded-3xl transform rotate-2"></div>
        {/* Main Container */}
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-indigo-100/60 shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Search Section */}
            <div className="flex-1 w-full lg:max-w-xl group">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã coupon hoặc tên..."
                  className={`block w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-white/70 backdrop-blur-sm placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all duration-300 ${
                    isSearchFocused ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  value={localSearchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {localSearchTerm && (
                  <button 
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-200"
                    onClick={() => setLocalSearchTerm("")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            {/* Status Filter & Add Button */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative w-full sm:w-64 group">
                <select
                  className={`block w-full pl-12 pr-10 py-4 border-2 rounded-xl bg-white/70 backdrop-blur-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm appearance-none transition-all duration-300 cursor-pointer ${
                    statusFilter ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value={COUPON_STATUS.ACTIVE}>Hoạt động</option>
                  <option value={COUPON_STATUS.INACTIVE}>Tạm dừng</option>
                  <option value={COUPON_STATUS.EXPIRED}>Hết hạn</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <button
                className="group relative inline-flex items-center justify-center px-6 py-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-700 hover:via-purple-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 transform hover:scale-105"
                onClick={onAddCoupon}
              >
                <Plus size={20} className="mr-2 transition-transform duration-300 group-hover:rotate-90" strokeWidth={2.5} />
                Thêm Coupon
              </button>
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
              {localSearchTerm && (
                <div className="inline-flex items-center bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 text-sm rounded-full px-4 py-2 border border-indigo-200/60 shadow-sm">
                  <Search size={14} className="mr-2" />
                  <span className="mr-2">&quot;{localSearchTerm}&quot;</span>
                  <button 
                    className="ml-1 p-1 rounded-full hover:bg-indigo-200/60 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                    onClick={() => setLocalSearchTerm("")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
              {statusFilter && (
                <div className="inline-flex items-center bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 text-sm rounded-full px-4 py-2 border border-emerald-200/60 shadow-sm">
                  <Filter size={14} className="mr-2" />
                  <span className="mr-2">
                    {statusFilter === COUPON_STATUS.ACTIVE ? "Hoạt động" : 
                     statusFilter === COUPON_STATUS.INACTIVE ? "Tạm dừng" : 
                     statusFilter === COUPON_STATUS.EXPIRED ? "Hết hạn" : statusFilter}
                  </span>
                  <button 
                    className="ml-1 p-1 rounded-full hover:bg-emerald-200/60 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" 
                    onClick={() => onStatusFilterChange("")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
              <button 
                className="text-sm text-slate-500 font-medium ml-auto hover:text-slate-700 transition-colors duration-200 flex items-center gap-1"
                onClick={clearAllFilters}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Xóa tất cả
              </button>
            </div>
          )}
        </div>
        <style jsx>{`
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
    );
  }
);

CouponFilter.displayName = "CouponFilter";

export default CouponFilter; 