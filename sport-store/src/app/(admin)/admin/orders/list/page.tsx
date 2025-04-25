"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import OrderListFilters from "@/components/admin/orders/list/orderListFilters";
import OrderListTable from "@/components/admin/orders/list/orderListTable";
import Pagination from "@/components/admin/orders/list/pagination";
import { Order } from "@/types/base";
import { toast } from "react-hot-toast";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export default function OrderListPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetchWithAuth<{
        orders: Order[];
        pagination: {
          totalPages: number;
          currentPage: number;
          totalItems: number;
        };
      }>(`/orders/admin?${queryParams}`);

      if (!response.success) {
        throw new Error(response.message || "Có lỗi xảy ra khi lấy danh sách đơn hàng");
      }

      if (!response.data) {
        throw new Error("Không nhận được dữ liệu từ server");
      }

      setOrders(response.data.orders);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy danh sách đơn hàng");
      setOrders([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

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

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchOrders();
    }
  }, [fetchOrders, isAuthenticated, user?.role]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
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

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#4EB09D] to-[#2C7A6C] p-6">
            <h1 className="text-2xl font-bold text-white">Quản lý đơn hàng</h1>
            <p className="text-white/80 mt-1">Xem và quản lý tất cả đơn hàng trong hệ thống</p>
          </div>
        </div>

        {/* Filters */}
        <OrderListFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          onAddOrder={handleAddOrder}
        />

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Đã chọn <span className="font-medium">{selectedOrders.length}</span> đơn hàng
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleDeleteOrders}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Xóa đã chọn
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4EB09D] mx-auto"></div>
          </div>
        ) : (
          <>
            <OrderListTable
              orders={orders}
              selectedOrders={selectedOrders}
              onToggleSelectAll={handleToggleSelectAll}
              onToggleSelectOrder={handleToggleSelectOrder}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}