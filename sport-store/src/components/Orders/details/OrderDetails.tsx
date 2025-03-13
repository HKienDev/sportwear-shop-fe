"use client";
import { useState } from "react";
import OrderHeader from "./OrderHeader";

// Định nghĩa trạng thái đơn hàng
enum OrderStatus {
  PENDING = "Chờ Xác Nhận",
  CONFIRMED = "Đã Xác Nhận",
  DELIVERED = "Giao Thành Công",
}

// Mô tả chi tiết từng trạng thái đơn hàng
const orderStatusInfo = {
  [OrderStatus.PENDING]: {
    color: "text-yellow-500",
    nextStatus: OrderStatus.CONFIRMED,
    buttonText: "✅ Xác Nhận Đơn Hàng",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
  },
  [OrderStatus.CONFIRMED]: {
    color: "text-blue-500",
    nextStatus: OrderStatus.DELIVERED,
    buttonText: "🚚 Giao Thành Công",
    buttonColor: "bg-green-500 hover:bg-green-600",
  },
  [OrderStatus.DELIVERED]: {
    color: "text-green-500",
    nextStatus: null,
    buttonText: "",
    buttonColor: "",
  },
};

export default function OrderDetails() {
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.PENDING);

  // Chuyển trạng thái đơn hàng
  const handleChangeStatus = () => {
    const nextStatus = orderStatusInfo[status].nextStatus;
    if (nextStatus) setStatus(nextStatus);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <OrderHeader
        orderId="#9233"
        customerId="76123671"
        lastUpdated="Thứ 2, Ngày 02 Tháng 02 Năm 2025"
        status={status}
        paymentStatus={status === OrderStatus.DELIVERED ? "Đã thanh toán" : "Chưa thanh toán"}
      />

      {/* Hiển thị trạng thái đơn hàng */}
      <p className={`mt-4 text-lg font-medium ${orderStatusInfo[status].color}`}>
        🛒 Trạng thái đơn hàng: {status}
      </p>

      {/* Hiển thị button nếu chưa hoàn thành */}
      {orderStatusInfo[status].nextStatus && (
        <button
          onClick={handleChangeStatus}
          className={`mt-4 px-4 py-2 text-white font-medium rounded-md transition ${orderStatusInfo[status].buttonColor}`}
        >
          {orderStatusInfo[status].buttonText}
        </button>
      )}
    </div>
  );
}