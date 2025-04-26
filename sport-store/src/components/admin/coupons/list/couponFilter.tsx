import React, { useCallback, useState, useEffect } from "react";
import { Search, Filter, Plus } from "lucide-react";

// Các hằng số cho trạng thái coupon
export const COUPON_STATUS = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Tạm Dừng",
  EXPIRED: "Hết hạn",
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
              placeholder="Tìm kiếm theo mã coupon hoặc tên..."
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200"
              value={localSearchTerm}
              onChange={handleSearchChange}
            />
            {localSearchTerm && (
              <button 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                onClick={() => setLocalSearchTerm("")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
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
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="">Tất cả trạng thái</option>
                <option value={COUPON_STATUS.ACTIVE}>Hoạt động</option>
                <option value={COUPON_STATUS.INACTIVE}>Tạm dừng</option>
                <option value={COUPON_STATUS.EXPIRED}>Hết hạn</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Nút thêm coupon */}
            <button
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              onClick={onAddCoupon}
            >
              <Plus size={18} className="mr-2" strokeWidth={2.5} />
              Thêm Coupon
            </button>
          </div>
        </div>

        {/* Hiển thị tags khi có bộ lọc đang áp dụng */}
        {(statusFilter || localSearchTerm) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs font-medium text-gray-500 self-center">Đang lọc:</span>
            
            {localSearchTerm && (
              <div className="inline-flex items-center bg-blue-50 text-blue-700 text-xs rounded-full px-3 py-1.5">
                <span className="mr-1">Tìm kiếm: {localSearchTerm}</span>
                <button 
                  className="ml-1 focus:outline-none" 
                  onClick={() => setLocalSearchTerm("")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            
            {statusFilter && (
              <div className={`inline-flex items-center text-xs rounded-full px-3 py-1.5 ${getCouponStatusColor(statusFilter)}`}>
                <span className="mr-1">
                  Trạng thái: {getCouponStatusText(statusFilter)}
                </span>
                <button 
                  className="ml-1 focus:outline-none" 
                  onClick={() => onStatusFilterChange("")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            
            <button 
              className="text-xs text-blue-600 font-medium ml-auto self-center transition-colors duration-200"
              onClick={() => {
                setLocalSearchTerm("");
                onSearchChange("");
                onStatusFilterChange("");
              }}
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>
    );
  }
);

CouponFilter.displayName = "CouponFilter";

export default CouponFilter; 