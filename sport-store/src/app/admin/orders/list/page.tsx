"use client";
import React, { useState, useEffect } from "react";

type Order = {
  _id: string;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Không có token. Vui lòng đăng nhập lại.");
        }

        const response = await fetch("http://localhost:4000/api/orders/admin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Lỗi khi lấy danh sách đơn hàng");
        }

        const data: Order[] = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu API không hợp lệ");
        }
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Chọn tất cả đơn hàng
  const toggleSelectAll = () => {
    setSelectedOrders(selectedOrders.length === orders.length ? [] : orders.map((order) => order._id));
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Danh sách đơn hàng</h1>

      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && orders.length > 0 && (
        <div className="bg-white rounded-md shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4"
                  />
                </th>
                <th className="px-4 py-3 text-left">Mã Đơn</th>
                <th className="px-4 py-3 text-left">Người Đặt</th>
                <th className="px-4 py-3 text-left">SĐT</th>
                <th className="px-4 py-3 text-left">Địa Chỉ</th>
                <th className="px-4 py-3 text-left">Tổng Tiền</th>
                <th className="px-4 py-3 text-left">Thanh Toán</th>
                <th className="px-4 py-3 text-left">Trạng Thái</th>
                <th className="px-4 py-3 text-left">Ngày Đặt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  {/* Chọn đơn hàng */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => toggleSelectOrder(order._id)}
                      className="w-4 h-4"
                    />
                  </td>

                  {/* Mã đơn hàng */}
                  <td className="px-4 py-3 text-blue-500">{order._id}</td>

                  {/* Người đặt hàng */}
                  <td className="px-4 py-3">{order.shippingAddress?.fullName || "Không có dữ liệu"}</td>

                  {/* Số điện thoại */}
                  <td className="px-4 py-3">{order.shippingAddress?.phone || "Không có dữ liệu"}</td>

                  {/* Địa chỉ giao hàng */}
                  <td className="px-4 py-3">
                    {order.shippingAddress
                      ? `${order.shippingAddress.address}, ${order.shippingAddress.city}`
                      : "Không có địa chỉ"}
                  </td>

                  {/* Tổng tiền đơn hàng */}
                  <td className="px-4 py-3">
                    {order.totalPrice !== undefined ? `${order.totalPrice.toLocaleString()} Vnđ` : "Chưa cập nhật"}
                  </td>

                  {/* Phương thức và trạng thái thanh toán */}
                  <td className="px-4 py-3">
                    {order.paymentMethod} -{" "}
                    <span className={order.paymentStatus === "paid" ? "text-green-500" : "text-red-500"}>
                      {order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                    </span>
                  </td>

                  {/* Trạng thái đơn hàng */}
                  <td className={`px-4 py-3 ${getStatusColor(order.status)}`}>{order.status}</td>

                  {/* Ngày đặt hàng */}
                  <td className="px-4 py-3">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Không có dữ liệu"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && orders.length === 0 && <p className="text-center text-gray-500">Không có đơn hàng nào.</p>}
    </div>
  );
}