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

      const response = await fetchWithAuth("/orders/admin");
      if (!response) {
        throw new Error("Không thể kết nối đến máy chủ");
      }
      
      const data = await response.json() as ApiResponse;
      
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
    setSelectedOrders((prev) => (prev.includes(id) ? prev.filter((orderId) => orderId !== id) : [...prev, id]));
  };

  const handleAddOrder = () => {
    router.push("/admin/orders/add");
  };

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "shipped":
        return "bg-green-500";
      case "delivered":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchOrders();
  };

  if (error) {
    return (
      <div className="text-red-500">
        <p>{error}</p>
        <button onClick={handleRetry} className="text-blue-500 underline mt-2">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">DANH SÁCH ĐƠN HÀNG</h1>

      {/* Thanh tìm kiếm & Bộ lọc */}
      <OrderListFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onAddOrder={handleAddOrder}
      />

      {loading && <p>Đang tải...</p>}

      {!loading && !error && filteredOrders.length > 0 && (
        <>
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
        </>
      )}
    </div>
  );
}