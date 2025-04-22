import React, { useCallback } from "react";

export function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "text-amber-500 bg-amber-50 border border-amber-200"; // Chờ xác nhận
    case "confirmed":
      return "text-blue-500 bg-blue-50 border border-blue-200"; // Đã xác nhận
    case "shipped":
      return "text-purple-500 bg-purple-50 border border-purple-200"; // Đang vận chuyển
    case "delivered":
      return "text-green-500 bg-green-50 border border-green-200"; // Đã giao hàng
    case "cancelled":
      return "text-red-500 bg-red-50 border border-red-200"; // Đã hủy
    default:
      return "text-gray-500 bg-gray-50 border border-gray-200"; // Không rõ trạng thái
  }
}

export function getStatusText(status: string): string {
  switch (status) {
    case "pending":
      return "Chờ xác nhận";
    case "confirmed":
      return "Đã xác nhận";
    case "shipped":
      return "Đang vận chuyển";
    case "delivered":
      return "Đã giao hàng";
    case "cancelled":
      return "Đã hủy";
    default:
      return "Không rõ trạng thái";
  }
}

interface OrderStatusBadgeProps {
  status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const memoizedGetStatusColor = useCallback(getStatusColor, []);
  const memoizedGetStatusText = useCallback(getStatusText, []);

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${memoizedGetStatusColor(status)}`}>
      {memoizedGetStatusText(status)}
    </span>
  );
}