"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Package, ShoppingBag, Search, Calendar, Filter, Eye } from "lucide-react";
import { Order } from "@/types/base";

interface OrderListProps {
  orders: Order[];
}

const statusColors = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  processing: "bg-blue-50 text-blue-700 border border-blue-200",
  shipped: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border border-rose-200"
} as const;

const statusIcons = {
  pending: <div className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></div>,
  processing: <div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></div>,
  shipped: <div className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5"></div>,
  delivered: <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></div>,
  cancelled: <div className="w-2 h-2 rounded-full bg-rose-500 mr-1.5"></div>
};

const ITEMS_PER_PAGE = 5;

export default function OrderList({ orders }: OrderListProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const handleOrderClick = (orderId: string) => {
    router.push(`/admin/orders/details/${orderId}`);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === "" || 
      order.shortId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === null || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];
  const statusLabels = {
    pending: "Chờ xác nhận",
    processing: "Đang xử lý",
    shipped: "Đang giao hàng",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy"
  };

  // Custom pagination component
  const CustomPagination = ({ currentPage, totalPages, onPageChange }: { 
    currentPage: number; 
    totalPages: number; 
    onPageChange: (page: number) => void;
  }) => {
    const getPageNumbers = () => {
      const pageNumbers = [];
      const maxPagesToShow = 5;
      
      if (totalPages <= maxPagesToShow) {
        // Show all pages
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Always show first page
        pageNumbers.push(1);
        
        // Calculate start and end of pages to show
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
        
        // Adjust if we're near the start
        if (currentPage <= 3) {
          endPage = 4;
        }
        
        // Adjust if we're near the end
        if (currentPage >= totalPages - 2) {
          startPage = totalPages - 3;
        }
        
        // Add ellipsis after first page if needed
        if (startPage > 2) {
          pageNumbers.push("...");
        }
        
        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
        
        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
          pageNumbers.push("...");
        }
        
        // Always show last page
        pageNumbers.push(totalPages);
      }
      
      return pageNumbers;
    };

    return (
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ${
            currentPage === 1 
              ? "text-slate-300 cursor-not-allowed" 
              : "text-slate-600 hover:bg-indigo-50"
          }`}
        >
          <ChevronRight className="h-4 w-4 transform rotate-180" />
        </button>
        
        {getPageNumbers().map((page, index) => (
          page === "..." 
            ? <span key={`ellipsis-${index}`} className="px-2 text-slate-400">...</span>
            : <button
                key={`page-${page}`}
                onClick={() => onPageChange(page as number)}
                className={`flex items-center justify-center w-8 h-8 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === page
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-indigo-50"
                }`}
              >
                {page}
              </button>
        ))}
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ${
            currentPage === totalPages
              ? "text-slate-300 cursor-not-allowed"
              : "text-slate-600 hover:bg-indigo-50"
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  // Custom badge component
  const Badge = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <span className={`inline-flex items-center rounded-full ${className}`}>
      {children}
    </span>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-indigo-50 px-6 py-6 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Lịch sử đơn hàng</h2>
              <p className="text-sm text-slate-600">Quản lý và theo dõi đơn hàng của khách hàng</p>
            </div>
            <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200">
              {filteredOrders.length} đơn hàng
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm mã đơn hàng..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full transition-all duration-200 text-sm bg-white"
              />
            </div>
            
            <div className="relative">
              <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <select
                value={filterStatus || ""}
                onChange={(e) => {
                  setFilterStatus(e.target.value || null);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none bg-white text-sm w-full transition-all duration-200"
              >
                <option value="">Tất cả trạng thái</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{statusLabels[status as keyof typeof statusLabels]}</option>
                ))}
              </select>
              <ChevronRight className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Không tìm thấy đơn hàng nào</h3>
            <p className="text-slate-500 max-w-md leading-relaxed">
              {searchTerm || filterStatus 
                ? "Không có đơn hàng nào khớp với điều kiện tìm kiếm. Hãy thử với từ khóa hoặc bộ lọc khác." 
                : "Chưa có đơn hàng nào được tạo. Đơn hàng sẽ xuất hiện ở đây khi khách hàng đặt hàng."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left">
                  <tr>
                    <th className="font-semibold text-slate-700 p-4 border-b border-slate-200">Mã đơn</th>
                    <th className="font-semibold text-slate-700 p-4 border-b border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        Ngày đặt
                      </div>
                    </th>
                    <th className="font-semibold text-slate-700 p-4 border-b border-slate-200">Tổng tiền</th>
                    <th className="font-semibold text-slate-700 p-4 border-b border-slate-200">Trạng thái</th>
                    <th className="font-semibold text-slate-700 p-4 border-b border-slate-200 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => (
                    <tr 
                      key={order._id} 
                      className="cursor-pointer hover:bg-indigo-50/30 transition-colors duration-200"
                      onClick={() => handleOrderClick(order._id)}
                    >
                      <td className="p-4 border-b border-slate-100 font-medium text-indigo-600">#{order.shortId}</td>
                      <td className="p-4 border-b border-slate-100">
                        <div className="flex flex-col">
                          <span className="text-slate-800">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                          <span className="text-xs text-slate-500">
                            {new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 border-b border-slate-100 font-medium text-slate-800">
                        {order.totalPrice.toLocaleString("vi-VN")}đ
                      </td>
                      <td className="p-4 border-b border-slate-100">
                        <Badge className={`${statusColors[order.status as keyof typeof statusColors]} px-3 py-1 font-medium flex items-center w-fit text-xs`}>
                          {statusIcons[order.status as keyof typeof statusIcons]}
                          {statusLabels[order.status as keyof typeof statusLabels]}
                        </Badge>
                      </td>
                      <td className="p-4 border-b border-slate-100 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderClick(order._id);
                          }}
                          className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200 px-3 py-1.5 rounded-lg font-medium text-sm flex items-center gap-1 ml-auto"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-slate-500">
                  Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} trên tổng số {filteredOrders.length} đơn hàng
                </div>
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}