"use client";
import { useState } from "react";
import { Clock, Package, Truck, Home } from "lucide-react";
import OrderHeader from "./orderHeader00";
import DeliveryTracking from "./deliveryTracking";
import ShippingAddress from "./shippingAddress";
import ShippingMethod from "./shippingMethod";
import OrderTable from "./orderTable00";

// Định nghĩa trạng thái đơn hàng
export enum OrderStatus {
  PENDING = "Chờ Xác Nhận",
  CONFIRMED = "Đã Xác Nhận",
  SHIPPED = "Đang Vận Chuyển",
  DELIVERED = "Giao Thành Công",
}

// Mô tả chi tiết từng trạng thái (export object)
export const orderStatusInfo = {
  [OrderStatus.PENDING]: {
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: Clock,
    nextStatus: OrderStatus.CONFIRMED,
    buttonText: "Xác Nhận Đơn Hàng",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    description: "Đơn hàng đang chờ xác nhận từ nhân viên bán hàng",
    date: "13/03/2025",
    time: "22:07"
  },
  [OrderStatus.CONFIRMED]: {
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Package,
    nextStatus: OrderStatus.SHIPPED,
    buttonText: "Bắt Đầu Vận Chuyển",
    buttonColor: "bg-purple-500 hover:bg-purple-600",
    description: "Đơn hàng đã được xác nhận và đang chuẩn bị hàng",
    date: "13/03/2025",
    time: "22:08"
  },
  [OrderStatus.SHIPPED]: {
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: Truck,
    nextStatus: OrderStatus.DELIVERED,
    buttonText: "Xác Nhận Giao Hàng Thành Công",
    buttonColor: "bg-green-500 hover:bg-green-600",
    description: "Đơn hàng đang được vận chuyển đến địa chỉ khách hàng",
    date: "13/03/2025",
    time: "22:20"
  },
  [OrderStatus.DELIVERED]: {
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: Home,
    nextStatus: null,
    buttonText: "",
    buttonColor: "",
    description: "Đơn hàng đã được giao thành công đến khách hàng",
    date: "15/03/2025",
    time: "15:20"
  },
};

export default function OrderDetails() {
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.PENDING);
  const [isLoading, setIsLoading] = useState(false);
  const statusInfo = orderStatusInfo[status];

  const handleChangeStatus = () => {
    const nextStatus = statusInfo.nextStatus;
    if (nextStatus) {
      setIsLoading(true);
      setTimeout(() => {
        setStatus(nextStatus);
        setIsLoading(false);
      }, 800);
    }
  };

  // Dữ liệu mẫu (sẽ thay thế bằng API sau này)
  const orderItems = [
    {
      id: "1",
      name: "Nike Air Zoom Mercurial Superfly X Elite FG",
      category: "Giày Đá Banh",
      color: "Đen",
      quantity: 1,
      price: 5200000,
      imageUrl: "/shoes.png",
    },
    // ... các item khác
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <OrderHeader
        orderId="VJUSPORTRQFZNAE"
        customerId="67cbbe4877860add29894c20"
        lastUpdated="Thứ 7, Ngày 15 Tháng 03 Năm 2025"
        status={status}
        paymentStatus={status === OrderStatus.DELIVERED ? "Đã thanh toán" : "Chưa thanh toán"}
      />

      {/* Delivery Tracking */}
      <DeliveryTracking
        status={status}
        onChangeStatus={handleChangeStatus}
        isLoading={isLoading}
      />

      {/* Delivery Information */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ShippingAddress
          name="Hoàng Kiên"
          address="Số 94, Đường Phú Mỹ, Thôn Phú Mỹ, Phường Mỹ Đình 2, Quận Nam Từ Liêm, Hà Nội"
          phone="0362195258"
        />
        <ShippingMethod
          method="Giao hàng nhanh"
          expectedDate="Dự kiến giao hàng: 15/03/2025 - 17/03/2025"
          courier="Viettel Post"
          trackingId="VJUSPORTRQFZNAE"
        />
      </div>

      {/* Order Table */}
      <OrderTable
        items={orderItems}
        shippingFee={30000}
        discount={500000}
      />
    </div>
  );
}