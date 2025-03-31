import React, { useCallback, useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface OrderListFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onAddOrder: () => void;
}

const OrderListFilters = React.memo(
  ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    onAddOrder,
  }: OrderListFiltersProps) => {
    // State tạm thời để lưu giá trị input tìm kiếm
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    // Debounce cho input tìm kiếm
    useEffect(() => {
      const handler = setTimeout(() => {
        if (localSearchTerm !== searchTerm) {
          onSearchChange(localSearchTerm);
        }
      }, 500); // Delay 500ms

      return () => clearTimeout(handler);
    }, [localSearchTerm, searchTerm, onSearchChange]);

    // Memoize hàm xử lý sự kiện để tránh re-render không cần thiết
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearchTerm(e.target.value);
    }, []);

    const handleStatusFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
      onStatusFilterChange(e.target.value);
    }, [onStatusFilterChange]);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 backdrop-blur-sm bg-opacity-95">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          {/* Input tìm kiếm */}
          <div className="relative flex-1 max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hoặc tên người đặt..."
              className="block w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all duration-200"
              value={localSearchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Lọc theo trạng thái */}
            <div className="relative">
              <select
                className="block w-full sm:w-52 pl-4 pr-10 py-2.5 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm rounded-lg appearance-none bg-white transition-all duration-200 cursor-pointer"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đang giao hàng</option>
                <option value="delivered">Giao hàng thành công</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Nút thêm đơn hàng */}
            <button
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={onAddOrder}
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Thêm Đơn Hàng
            </button>
          </div>
        </div>
      </div>
    );
  }
);

OrderListFilters.displayName = "OrderListFilters";

export default OrderListFilters;