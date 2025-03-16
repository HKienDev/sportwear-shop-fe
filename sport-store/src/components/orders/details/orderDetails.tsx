"use client";
import { useState, useCallback } from "react";
import { Clock, Package, Truck, Home } from "lucide-react";
import OrderHeader from "./orderHeader";
import DeliveryTracking from "./deliveryTracking";
import ShippingAddress from "./shippingAddress";
import ShippingMethod from "./shippingMethod";
import OrderTable from "./orderTable";
import { Order } from "@/types/order";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { toast } from "react-hot-toast";

// Định nghĩa trạng thái đơn hàng
export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled"
}

// Mô tả chi tiết từng trạng thái
export const orderStatusInfo = {
  [OrderStatus.PENDING]: {
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: Clock,
    nextStatus: OrderStatus.PROCESSING,
    buttonText: "Xác Nhận Đơn Hàng",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    description: "Đơn hàng đang chờ xác nhận từ nhân viên bán hàng",
    date: "13/03/2025",
    time: "22:07"
  },
  [OrderStatus.PROCESSING]: {
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
  [OrderStatus.CANCELLED]: {
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: Clock,
    nextStatus: null,
    buttonText: "",
    buttonColor: "",
    description: "Đơn hàng đã bị hủy",
    date: "15/03/2025",
    time: "15:20"
  }
};

interface OrderDetailsProps {
  order: Order;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const [status, setStatus] = useState<string>(order.status);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeStatus = useCallback(async (newStatus: string) => {
    if (!order || isLoading) return;

    try {
      setIsLoading(true);
      const response = await fetchWithAuth(
        `/orders/admin/${order._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Có lỗi xảy ra khi cập nhật trạng thái");
      }

      toast.success("Cập nhật trạng thái thành công");
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setIsLoading(false);
    }
  }, [order, isLoading]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <OrderHeader
        orderId={order.shortId}
        customerId={order.user}
        lastUpdated={new Date(order.createdAt).toLocaleString("vi-VN")}
        status={status}
        paymentStatus={order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
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
          name={order.shippingAddress.fullName}
          address={order.shippingAddress.address}
          phone={order.shippingAddress.phone}
          city={order.shippingAddress.city}
          district={order.shippingAddress.district}
          ward={order.shippingAddress.ward}
          postalCode={order.shippingAddress.postalCode}
        />
        <ShippingMethod
          method={order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Thanh toán online"}
          expectedDate="Dự kiến giao hàng: 15/03/2025 - 17/03/2025"
          courier="Viettel Post"
          trackingId={order.shortId}
          shippingMethod={order.shippingMethod?.method || "Vận chuyển thường"}
        />
      </div>

      {/* Order Table */}
      <OrderTable
        items={order.items}
        shippingFee={order.shippingFee || 0}
        discount={order.discount || 0}
      />
    </div>
  );
}