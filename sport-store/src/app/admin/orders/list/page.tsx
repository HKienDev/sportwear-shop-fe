"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/types/order";
import { fetchWithAuth } from "@/lib/api";
import OrderListTable from "@/components/admin/orders/list/orderListTable";
import OrderListFilters from "@/components/admin/orders/list/orderListFilters";
import Pagination from "@/components/admin/orders/list/pagination";
import { getStatusColor } from "@/components/admin/orders/list/orderStatusBadge";

const ITEMS_PER_PAGE = 10;

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchWithAuth("/orders/admin");
        if (!response) {
          throw new Error("Không thể kết nối đến server");
        }

        const responseData = await response.json();
        console.log("Orders API Response:", responseData);

        if (!responseData.success) {
          throw new Error(responseData.message || "Không thể tải danh sách đơn hàng");
        }

        if (!Array.isArray(responseData.data)) {
          throw new Error("Dữ liệu API không hợp lệ");
        }

        setOrders(responseData.data);
        setFilteredOrders(responseData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Tìm kiếm đơn hàng theo mã đơn hoặc tên khách hàng
  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.shortId.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.shippingAddress?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  }, [searchTerm, orders]);

  // Lọc đơn hàng theo trạng thái
  useEffect(() => {
    if (!statusFilter) {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === statusFilter));
    }
    setCurrentPage(1); // Reset về trang 1 khi lọc
  }, [statusFilter, orders]);

  // Chọn tất cả đơn hàng
  const toggleSelectAll = () => {
    setSelectedOrders(selectedOrders.length === currentOrders.length ? [] : currentOrders.map((order) => order._id));
  };

  // Chọn một đơn hàng
  const toggleSelectOrder = (id: string) => {
    setSelectedOrders((prev) => (prev.includes(id) ? prev.filter((orderId) => orderId !== id) : [...prev, id]));
  };

  // Xử lý thêm đơn hàng mới
  const handleAddOrder = () => {
    router.push("/admin/orders/add");
  };

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
      {error && <p className="text-red-500">{error}</p>}

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