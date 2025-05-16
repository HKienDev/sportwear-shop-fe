"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import OrderListFilters from "@/components/admin/orders/list/orderListFilters";
import OrderListTable from "@/components/admin/orders/list/orderListTable";
import { Order } from "@/types/base";
import { toast } from "react-hot-toast";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { api } from '@/lib/api';

export default function OrderListPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/admin');
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Không thể lấy danh sách đơn hàng");
      }

      setOrders(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy danh sách đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

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
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 to-indigo-50/40">
      {/* Glass Morphism Wrapper */}
      <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header with 3D-like Effect */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-indigo-600 opacity-5 rounded-2xl transform -rotate-1"></div>
          <div className="absolute inset-0 bg-emerald-600 opacity-5 rounded-2xl transform rotate-1"></div>
          <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-lg border border-indigo-100/60 overflow-hidden relative z-10">
            <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 p-6 sm:p-8">
              <h1 className="text-3xl font-bold text-white tracking-tight relative">
                Quản lý đơn hàng
                <span className="absolute -top-1 left-0 w-full h-full bg-white opacity-10 transform skew-x-12 translate-x-32"></span>
              </h1>
              <p className="text-indigo-50 mt-2 max-w-2xl text-opacity-90">Xem và quản lý tất cả đơn hàng trong hệ thống</p>
            </div>
          </div>
        </div>

        {/* Filters - Unboxed as requested */}
        <div className="mb-6">
          <OrderListFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            onAddOrder={handleAddOrder}
          />
        </div>

        {/* Bulk Actions - With Animation */}
        {selectedOrders.length > 0 && (
          <div 
            className="mb-6 relative overflow-hidden" 
            style={{
              animation: "slideInFromTop 0.3s ease-out forwards"
            }}
          >
            <div className="absolute inset-0 bg-rose-500 opacity-5 rounded-xl transform rotate-1"></div>
            <div className="absolute inset-0 bg-rose-500 opacity-5 rounded-xl transform -rotate-1"></div>
            <div className="bg-white backdrop-blur-sm rounded-xl shadow-lg border border-rose-100 p-4 relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-600 font-semibold mr-3">
                    {selectedOrders.length}
                  </span>
                  <span className="text-slate-700">đơn hàng đã được chọn</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedOrders([])}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 flex items-center text-sm"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Bỏ chọn
                  </button>
                  <button
                    onClick={handleDeleteOrders}
                    disabled={isDeleting}
                    className="group px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30"
                  >
                    {isDeleting ? (
                      <>
                        <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xóa...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1.5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Xóa đã chọn
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table Container with Glass Effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 opacity-5 rounded-2xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-emerald-500 opacity-5 rounded-2xl transform -rotate-1"></div>
          <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-lg border border-indigo-100/60 overflow-hidden relative z-10">
            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center">
                <div className="loading-animation">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                <p className="mt-6 text-slate-500 font-medium">Đang tải dữ liệu...</p>
                <style jsx>{`
                  .loading-animation {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                  }
                  
                  .dot {
                    width: 12px;
                    height: 12px;
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
                      transform: translateY(-15px);
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
            ) : orders.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-300 to-emerald-300 opacity-20 animate-pulse"></div>
                  <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                    <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-medium text-slate-800">Không tìm thấy đơn hàng</h3>
                <p className="mt-2 text-slate-500 max-w-sm">
                  Hiện không có đơn hàng nào phù hợp với điều kiện tìm kiếm của bạn.
                </p>
                <button 
                  onClick={() => {setSearchTerm(""); setStatusFilter("");}}
                  className="mt-6 px-5 py-2.5 bg-gradient-to-r from-indigo-50 to-emerald-50 text-indigo-600 rounded-lg hover:from-indigo-100 hover:to-emerald-100 transition-all duration-200 font-medium"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto relative">
                {/* Table Scroll Shadow Effect */}
                <div className="absolute pointer-events-none inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute pointer-events-none inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10"></div>
                
                {/* Enhanced Table */}
                <div className="min-w-full">
                  <OrderListTable
                    orders={orders}
                    selectedOrders={selectedOrders}
                    onToggleSelectAll={handleToggleSelectAll}
                    onToggleSelectOrder={handleToggleSelectOrder}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}