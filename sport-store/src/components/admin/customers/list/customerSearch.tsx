import React, { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";

interface CustomerSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: {
    status: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
  }) => void;
}

export function CustomerSearch({
  onSearch,
  onFilterChange,
}: CustomerSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc" as const,
  });

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch]);

  const handleFilterChange = (
    key: keyof typeof filters,
    value: string
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      status: "all",
      sortBy: "createdAt",
      sortOrder: "desc" as const,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        {/* Input tìm kiếm */}
        <div className="relative flex-1 max-w-xl w-full group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-blue-400 group-focus-within:text-blue-500 transition-colors duration-200" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Lọc theo trạng thái */}
          <div className="relative w-full sm:w-64 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter size={16} className="text-blue-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            </div>
            <select
              className="block w-full pl-11 pr-10 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm appearance-none transition-all duration-200 cursor-pointer"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Hiển thị tags khi có bộ lọc đang áp dụng */}
      {(filters.status !== "all" || searchQuery) && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs font-medium text-gray-500 self-center">Đang lọc:</span>
          
          {searchQuery && (
            <div className="inline-flex items-center bg-blue-50 text-blue-700 text-xs rounded-full px-3 py-1.5">
              <span className="mr-1">Tìm kiếm: {searchQuery}</span>
              <button 
                className="ml-1 focus:outline-none" 
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          
          {filters.status !== "all" && (
            <div className="inline-flex items-center bg-blue-50 text-blue-700 text-xs rounded-full px-3 py-1.5">
              <span className="mr-1">
                Trạng thái: {
                  filters.status === "active" ? "Hoạt động" :
                  filters.status === "inactive" ? "Không hoạt động" : filters.status
                }
              </span>
              <button 
                className="ml-1 focus:outline-none" 
                onClick={() => handleFilterChange("status", "all")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          
          <button 
            className="text-xs text-blue-600 font-medium ml-auto self-center transition-colors duration-200"
            onClick={clearFilters}
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}
    </div>
  );
} 