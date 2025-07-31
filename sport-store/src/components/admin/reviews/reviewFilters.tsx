"use client";

import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";

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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Bộ lọc</h3>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            {isExpanded ? "Thu gọn" : "Mở rộng"}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề, nội dung..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đánh giá sao
            </label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange("rating", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
          </div>

          {/* Product SKU Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã sản phẩm
            </label>
            <input
              type="text"
              placeholder="Nhập SKU sản phẩm..."
              value={filters.productSku}
              onChange={(e) => handleFilterChange("productSku", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Active Filters Display */}
                        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {filters.rating && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Đánh giá: {filters.rating} sao
                  <button
                    onClick={() => handleFilterChange("rating", "")}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.productSku && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  SKU: {filters.productSku}
                  <button
                    onClick={() => handleFilterChange("productSku", "")}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.searchTerm && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Tìm kiếm: {filters.searchTerm}
                  <button
                    onClick={() => handleFilterChange("searchTerm", "")}
                    className="ml-1 text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default ReviewFilters; 