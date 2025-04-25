"use client";

import { useState } from "react";
import { Clock, Package, Truck, Home } from "lucide-react";
import { OrderStatus } from "@/types/base";

interface DeliveryTrackingProps {
  status: OrderStatus;
  onChangeStatus: (status: OrderStatus) => void;
  isLoading: boolean;
}

export default function DeliveryTracking({
  status,
  onChangeStatus,
  isLoading,
}: DeliveryTrackingProps) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(status);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setCurrentStatus(newStatus);
    await onChangeStatus(newStatus);
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "Chờ xác nhận";
      case OrderStatus.CONFIRMED:
        return "Đơn hàng đã được xác nhận và đang chuẩn bị hàng";
      case OrderStatus.SHIPPED:
        return "Đơn hàng đang được vận chuyển";
      case OrderStatus.DELIVERED:
        return "Đơn hàng đã được giao thành công";
      case OrderStatus.CANCELLED:
        return "Đơn hàng đã bị hủy";
      default:
        return "Chờ xác nhận";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className="w-6 h-6" />;
      case OrderStatus.CONFIRMED:
        return <Package className="w-6 h-6" />;
      case OrderStatus.SHIPPED:
        return <Truck className="w-6 h-6" />;
      case OrderStatus.DELIVERED:
        return <Home className="w-6 h-6" />;
      case OrderStatus.CANCELLED:
        return <Clock className="w-6 h-6" />;
      default:
        return <Clock className="w-6 h-6" />;
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case OrderStatus.PENDING:
        return OrderStatus.CONFIRMED;
      case OrderStatus.CONFIRMED:
        return OrderStatus.SHIPPED;
      case OrderStatus.SHIPPED:
        return OrderStatus.DELIVERED;
      case OrderStatus.DELIVERED:
      case OrderStatus.CANCELLED:
        return null;
      default:
        return OrderStatus.CONFIRMED;
    }
  };

  const nextStatus = getNextStatus(currentStatus);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Theo Dõi Đơn Hàng</h3>
        {nextStatus && (
          <button
            onClick={() => handleStatusChange(nextStatus)}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật trạng thái"}
          </button>
        )}
      </div>

      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
        <div className="relative flex justify-between">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(currentStatus)
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }`}
            >
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-600">Chờ xác nhận</span>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                [OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(currentStatus)
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }`}
            >
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-600">Đã xác nhận</span>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                [OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(currentStatus)
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }`}
            >
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-600">Đang vận chuyển</span>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                currentStatus === OrderStatus.DELIVERED ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-gray-600">Đã giao hàng</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          {getStatusIcon(currentStatus)}
          <span className="text-gray-700">{getStatusText(currentStatus)}</span>
        </div>
      </div>
    </div>
  );
}