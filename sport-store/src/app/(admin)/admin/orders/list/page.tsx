"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import OrderListFilters from "@/components/admin/orders/list/orderListFilters";
import OrderListTable from "@/components/admin/orders/list/orderListTable";
import { Order } from "@/types/base";
import { toast } from "sonner";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export default function OrderListPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  // DEBUG LOG
  console.log('[OrderListPage] user:', user, 'isAuthenticated:', isAuthenticated, 'loading:', loading);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/orders/admin');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Không thể lấy danh sách đơn hàng");
      }

      setOrders(data.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy danh sách đơn hàng");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Delete orders
  const handleDeleteOrders = useCallback(async () => {
    if (selectedOrders.length === 0) {
      toast.error("Vui lòng chọn đơn hàng cần xóa");
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedOrders.length} đơn hàng đã chọn?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetchWithAuth<{ success: boolean; message: string }>("/orders/bulk-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderIds: selectedOrders }),
      });

      if (!response.success) {
        throw new Error(response.message || "Có lỗi xảy ra khi xóa đơn hàng");
      }

      toast.success("Xóa đơn hàng thành công");
      setSelectedOrders([]);
      fetchOrders();
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa đơn hàng");
    } finally {
      setIsDeleting(false);
    }
  }, [selectedOrders, fetchOrders]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  const handleAddOrder = useCallback(() => {
    router.push("/admin/orders/add");
  }, [router]);

  const handleToggleSelectAll = useCallback(() => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order._id));
    }
  }, [orders, selectedOrders]);

  const handleToggleSelectOrder = useCallback((id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) 
        ? prev.filter(orderId => orderId !== id)
        : [...prev, id]
    );
  }, []);

  // Redirect if not authenticated or not admin
  if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
    console.log('[OrderListPage] Không phải admin hoặc chưa xác thực, chuyển hướng về /admin/login');
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40">
      {/* Glass Morphism Wrapper */}
      <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header with 3D-like Effect */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-emerald-600/10 rounded-3xl transform -rotate-2"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-indigo-600/10 rounded-3xl transform rotate-2"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-indigo-100/60 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight relative">
                    Quản lý đơn hàng
                    <span className="absolute -top-1 left-0 w-full h-full bg-white opacity-10 transform skew-x-12 translate-x-32"></span>
                  </h1>
                  <p className="text-indigo-100 mt-3 max-w-2xl text-lg">
                    Xem và quản lý tất cả đơn hàng trong hệ thống với giao diện hiện đại
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">Hệ thống hoạt động</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <OrderListFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          onAddOrder={handleAddOrder}
        />

        {/* Bulk Actions - With Enhanced Animation */}
        {selectedOrders.length > 0 && (
          <div 
            className="mb-6 relative overflow-hidden" 
            style={{
              animation: "slideInFromTop 0.4s ease-out forwards"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-2xl transform rotate-1"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-2xl transform -rotate-1"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100/60 shadow-xl p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg">
                    <span className="text-white font-bold text-lg">{selectedOrders.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-700 font-semibold">đơn hàng đã được chọn</span>
                    <p className="text-sm text-slate-500">Sẵn sàng thực hiện thao tác hàng loạt</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setSelectedOrders([])}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-400/20 flex items-center text-sm font-medium shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Bỏ chọn tất cả
                  </button>
                  <button
                    onClick={handleDeleteOrders}
                    disabled={isDeleting}
                    className="group px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-rose-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm font-semibold shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/35 transform hover:scale-105"
                  >
                    {isDeleting ? (
                      <>
                        <svg className="animate-spin mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xóa...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Xóa đã chọn ({selectedOrders.length})
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table Container with Enhanced Glass Effect */}
        <div className="relative">
          {isLoading ? (
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-indigo-100/60 shadow-xl p-12">
              <div className="flex flex-col items-center justify-center">
                <div className="loading-animation mb-6">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                <p className="text-lg font-semibold text-slate-700 mb-2">Đang tải dữ liệu...</p>
                <p className="text-slate-500 text-center max-w-sm">Vui lòng chờ trong giây lát, chúng tôi đang xử lý yêu cầu của bạn</p>
                <style jsx>{`
                  .loading-animation {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 12px;
                  }
                  
                  .dot {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: linear-gradient(to right, #4f46e5, #10b981);
                    animation: bounce 1.5s infinite ease-in-out;
                  }
                  
                  .dot:nth-child(1) {
                    animation-delay: 0s;
                  }
                  
                  .dot:nth-child(2) {
                    animation-delay: 0.2s;
                  }
                  
                  .dot:nth-child(3) {
                    animation-delay: 0.4s;
                  }
                  
                  @keyframes bounce {
                    0%, 100% {
                      transform: translateY(0);
                    }
                    50% {
                      transform: translateY(-20px);
                    }
                  }
                  
                  @keyframes slideInFromTop {
                    0% {
                      transform: translateY(-20px);
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
          ) : orders.length === 0 ? (
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-indigo-100/60 shadow-xl p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-300 to-emerald-300 opacity-20 animate-pulse"></div>
                  <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Không tìm thấy đơn hàng</h3>
                <p className="text-slate-600 max-w-md mb-6 text-lg">
                  Hiện không có đơn hàng nào phù hợp với điều kiện tìm kiếm của bạn. 
                  Hãy thử điều chỉnh bộ lọc hoặc tạo đơn hàng mới.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => {setSearchTerm(""); setStatusFilter("");}}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-emerald-50 text-indigo-700 rounded-xl hover:from-indigo-100 hover:to-emerald-100 transition-all duration-300 font-semibold border border-indigo-200/60"
                  >
                    Xóa bộ lọc
                  </button>
                  <button 
                    onClick={handleAddOrder}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white rounded-xl hover:from-indigo-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg shadow-indigo-500/25"
                  >
                    Tạo đơn hàng mới
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <OrderListTable
              orders={orders}
              selectedOrders={selectedOrders}
              onToggleSelectAll={handleToggleSelectAll}
              onToggleSelectOrder={handleToggleSelectOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
}