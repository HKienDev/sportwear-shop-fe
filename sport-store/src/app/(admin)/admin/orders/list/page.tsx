"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import OrderListFilters from "@/components/admin/orders/list/orderListFilters";
import OrderListTable from "@/components/admin/orders/list/orderListTable";
import Pagination from "@/components/admin/orders/list/pagination";
import { getStatusColor } from "@/components/admin/orders/list/orderStatusBadge";
import { Order } from "@/types/order";
import { toast } from "react-hot-toast";

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

      const response = await fetch(`/api/orders/admin?${queryParams}`);
      
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Có lỗi xảy ra khi lấy danh sách đơn hàng");
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Có lỗi xảy ra khi lấy danh sách đơn hàng");
      }

      setOrders(data.data.orders);
      setTotalPages(data.data.pagination.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy danh sách đơn hàng");
      setOrders([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
              getStatusColor={getStatusColor}
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