"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/types/order";
import { fetchWithAuth } from "@/lib/api";
import OrderListTable from "@/components/admin/orders/list/orderListTable";
import OrderListFilters from "@/components/admin/orders/list/orderListFilters";
import { getStatusColor } from "@/components/admin/orders/list/orderStatusBadge";

export default function OrdersPage() {
  const router = useRouter();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // Tìm kiếm
  const [statusFilter, setStatusFilter] = useState(""); // Bộ lọc trạng thái

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchWithAuth("http://localhost:4000/api/orders/admin", { method: "GET" });

        if (!response || !response.ok) {
          throw new Error("Lỗi khi lấy danh sách đơn hàng");
        }

        const data: Order[] = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu API không hợp lệ");
        }

        setOrders(data);
        setFilteredOrders(data);
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
        order.shortId.includes(searchTerm) || 
        order.customer?.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  // Lọc đơn hàng theo trạng thái
  useEffect(() => {
    if (!statusFilter) {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === statusFilter));
    }
  }, [statusFilter, orders]);

  // Chọn tất cả đơn hàng
  const toggleSelectAll = () => {
    setSelectedOrders(selectedOrders.length === filteredOrders.length ? [] : filteredOrders.map((order) => order._id));
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
        <OrderListTable
          orders={filteredOrders}
          selectedOrders={selectedOrders}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectOrder={toggleSelectOrder}
          getStatusColor={getStatusColor}
        />
      )}
    </div>
  );
}