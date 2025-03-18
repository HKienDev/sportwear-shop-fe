"use client";

import { useState } from "react";
import { Clock, Package, Truck, Home } from "lucide-react";

interface DeliveryTrackingProps {
  status: string;
  onChangeStatus: (status: string) => void;
  isLoading: boolean;
}

export default function DeliveryTracking({
  status,
  onChangeStatus,
  isLoading,
}: DeliveryTrackingProps) {
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = async (newStatus: string) => {
    setCurrentStatus(newStatus);
    await onChangeStatus(newStatus);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đơn hàng đã được xác nhận và đang chuẩn bị hàng";
      case "shipped":
        return "Đơn hàng đang được vận chuyển";
      case "delivered":
        return "Đơn hàng đã được giao thành công";
      case "cancelled":
        return "Đơn hàng đã bị hủy";
      default:
        return "Chờ xác nhận";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-6 h-6" />;
      case "processing":
        return <Package className="w-6 h-6" />;
      case "shipped":
        return <Truck className="w-6 h-6" />;
      case "delivered":
        return <Home className="w-6 h-6" />;
      case "cancelled":
        return <Clock className="w-6 h-6" />;
      default:
        return <Clock className="w-6 h-6" />;
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending":
        return "processing";
      case "processing":
        return "shipped";
      case "shipped":
        return "delivered";
      case "delivered":
        return null;
      case "cancelled":
        return null;
      default:
        return "processing";
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
                ["pending", "processing", "shipped", "delivered", "cancelled"].includes(currentStatus)
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
                ["processing", "shipped", "delivered", "cancelled"].includes(currentStatus)
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
                ["shipped", "delivered", "cancelled"].includes(currentStatus)
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
                currentStatus === "delivered" ? "bg-blue-500" : "bg-gray-300"
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