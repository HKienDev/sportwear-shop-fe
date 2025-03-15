"use client";
import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib0/api";

type Order = {
  _id: string;
  shortId: string;
  user: string;
  items: {
    product: { _id: string; name: string; price: number };
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  paymentMethod: "COD" | "Stripe";
  paymentStatus: "pending" | "paid";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  createdAt: string;
};

export default function OrdersPage() {
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
        order.shippingAddress?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Đổi màu trạng thái đơn hàng
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500"; // Chờ xác nhận
      case "processing":
        return "text-blue-500"; // Đang xử lý
      case "shipped":
        return "text-orange-500"; // Đang giao
      case "delivered":
        return "text-green-500"; // Đã giao
      case "cancelled":
        return "text-red-500"; // Đã hủy
      default:
        return "text-gray-500"; // Không rõ trạng thái
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">DANH SÁCH ĐƠN HÀNG</h1>

      {/* Thanh tìm kiếm & Bộ lọc */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Bạn cần tìm gì?"
          className="border border-gray-300 rounded-md px-4 py-2 w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex gap-4">
          {/* Lọc theo trạng thái */}
          <select
            className="border border-gray-300 rounded-md px-4 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đang giao hàng</option>
            <option value="delivered">Giao hàng thành công</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          {/* Nút thêm đơn hàng */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">+ Thêm Đơn Hàng</button>
        </div>
      </div>

      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && filteredOrders.length > 0 && (
        <div className="bg-white rounded-md shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4"
                  />
                </th>
                <th className="px-4 py-3 text-left">Mã Đơn</th>
                <th className="px-4 py-3 text-left">Người Đặt</th>
                <th className="px-4 py-3 text-left">Địa Chỉ</th>
                <th className="px-4 py-3 text-left">Tổng Tiền</th>
                <th className="px-4 py-3 text-left">Thanh Toán</th>
                <th className="px-4 py-3 text-left">Trạng Thái</th>
                <th className="px-4 py-3 text-left">Ngày Đặt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => toggleSelectOrder(order._id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-4 py-3 text-blue-500">{order.shortId}</td>
                  <td className="px-4 py-3">{order.shippingAddress?.fullName || "Không có dữ liệu"}</td>
                  <td className="px-4 py-3">{order.shippingAddress?.city || "Không có dữ liệu"}</td>
                  <td className="px-4 py-3">{order.totalPrice.toLocaleString()} Vnđ</td>
                  <td className="px-4 py-3">{order.paymentMethod} - <span className={order.paymentStatus === "paid" ? "text-green-500" : "text-red-500"}>{order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}</span></td>
                  <td className={`px-4 py-3 ${getStatusColor(order.status)}`}>{order.status}</td>
                  <td className="px-4 py-3">{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}