import React, { useCallback, useState, useEffect } from "react";
import { Search, Filter, Plus, X, Sparkles } from "lucide-react";

interface ProductListFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  onAddProduct: () => void;
  categories: Array<{
    _id: string;
    categoryId: string;
    name: string;
    slug: string;
  }>;
}

const ProductListFilters = React.memo(
  ({
    searchTerm,
    onSearchChange,
    categoryFilter,
    onCategoryFilterChange,
    onAddProduct,
    categories,
  }: ProductListFiltersProps) => {
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

    const handleCategoryFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
      onCategoryFilterChange(e.target.value);
    }, [onCategoryFilterChange]);

    const clearAllFilters = useCallback(() => {
      setLocalSearchTerm("");
      onSearchChange("");
      onCategoryFilterChange("");
    }, [onSearchChange, onCategoryFilterChange]);

    const hasActiveFilters = localSearchTerm || categoryFilter;

    return (
      <div className="relative">
        {/* Enhanced Glass Morphism Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-emerald-600/10 rounded-3xl transform -rotate-2"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-indigo-600/10 rounded-3xl transform rotate-2"></div>
        
        {/* Main Container with Enhanced Glass Effect */}
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-indigo-100/60 shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Enhanced Search Section */}
            <div className="flex-1 w-full lg:max-w-xl group">
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${
                  isSearchFocused ? 'text-indigo-500' : 'text-slate-400'
                }`}>
                  <Search size={20} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên sản phẩm hoặc mã SKU..."
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
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Enhanced Filters & Actions Section */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Enhanced Category Filter */}
              <div className="relative w-full sm:w-72 group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${
                  categoryFilter ? 'text-emerald-500' : 'text-slate-400'
                }`}>
                  <Filter size={18} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                <select
                  className={`block w-full pl-12 pr-10 py-4 border-2 rounded-xl bg-white/70 backdrop-blur-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm appearance-none transition-all duration-300 cursor-pointer ${
                    categoryFilter ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  value={categoryFilter}
                  onChange={handleCategoryFilterChange}
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Enhanced Add Product Button */}
              <button
                className="group relative inline-flex items-center justify-center px-6 py-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-700 hover:via-purple-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 transform hover:scale-105"
                onClick={onAddProduct}
              >
                <Plus size={20} className="mr-2 transition-transform duration-300 group-hover:rotate-90" strokeWidth={2.5} />
                Thêm Sản Phẩm
                <Sparkles size={16} className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse" />
              </button>
            </div>
          </div>

          {/* Enhanced Active Filters Display */}
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
                    <X size={12} />
                  </button>
                </div>
              )}
              
              {categoryFilter && (
                <div className="inline-flex items-center bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 text-sm rounded-full px-4 py-2 border border-emerald-200/60 shadow-sm">
                  <Filter size={14} className="mr-2" />
                  <span className="mr-2">
                    {categories.find(cat => cat._id === categoryFilter)?.name || categoryFilter}
                  </span>
                  <button 
                    className="ml-1 p-1 rounded-full hover:bg-emerald-200/60 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" 
                    onClick={() => onCategoryFilterChange("")}
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              
              <button 
                className="text-sm text-slate-500 font-medium ml-auto hover:text-slate-700 transition-colors duration-200 flex items-center gap-1"
                onClick={clearAllFilters}
              >
                <X size={14} />
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

ProductListFilters.displayName = "ProductListFilters";

export default ProductListFilters; 