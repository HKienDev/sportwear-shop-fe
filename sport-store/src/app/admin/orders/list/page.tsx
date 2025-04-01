"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/types/order";
import { fetchWithAuth } from "@/lib/api";
import OrderListTable from "@/components/admin/orders/list/orderListTable";
import OrderListFilters from "@/components/admin/orders/list/orderListFilters";
import Pagination from "@/components/admin/orders/list/pagination";

const ITEMS_PER_PAGE = 10;

interface ApiResponse {
  success: boolean;
  message?: string;
  data: Order[];
}

export default function OrdersPage() {
  const router = useRouter();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // Tìm kiếm
  const [statusFilter, setStatusFilter] = useState(""); // Bộ lọc trạng thái

  // Tính toán số trang và danh sách đơn hàng hiện tại
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchWithAuth("/orders/admin") as ApiResponse;
      
      if (!data?.success) {
        throw new Error(data?.message || "Không thể tải danh sách đơn hàng");
      }

      if (!Array.isArray(data?.data)) {
        throw new Error("Dữ liệu không hợp lệ");
      }

      setOrders(data.data);
      setFilteredOrders(data.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi tải danh sách đơn hàng";
      setError(errorMessage);

      if (errorMessage.includes("đăng nhập")) {
        router.push("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    let filtered = orders;

    // Tìm kiếm theo searchTerm
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.shortId.toLowerCase().includes(searchTerm.toLowerCase()) || 
          order.shippingAddress?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo trạng thái
    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm hoặc lọc
  }, [searchTerm, statusFilter, orders]);

  const toggleSelectAll = () => {
    setSelectedOrders(selectedOrders.length === currentOrders.length ? [] : currentOrders.map((order) => order._id));
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) 
        ? prev.filter(orderId => orderId !== id)
        : [...prev, id]
    );
  };

  const handleAddOrder = () => {
    router.push("/admin/orders/add");
  };

  const handleRetry = () => {
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "shipped":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <button
          onClick={handleAddOrder}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Thêm đơn hàng mới
        </button>
      </div>

      <OrderListFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onAddOrder={handleAddOrder}
      />

      <OrderListTable
        orders={currentOrders}
        selectedOrders={selectedOrders}
        onToggleSelectAll={toggleSelectAll}
        onToggleSelectOrder={toggleSelectOrder}
        getStatusColor={getStatusColor}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}