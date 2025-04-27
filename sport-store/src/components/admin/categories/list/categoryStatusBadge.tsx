import React, { useCallback } from "react";

export function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "text-green-500 bg-green-50 border border-green-200"; // Đang hoạt động
    case "inactive":
      return "text-red-500 bg-red-50 border border-red-200"; // Không hoạt động
    default:
      return "text-gray-500 bg-gray-50 border border-gray-200"; // Không rõ trạng thái
  }
}

export function getStatusText(status: string): string {
  switch (status) {
    case "active":
      return "Đang hoạt động";
    case "inactive":
      return "Không hoạt động";
    default:
      return "Không rõ trạng thái";
  }
}

interface CategoryStatusBadgeProps {
  status: string;
}

export default function CategoryStatusBadge({ status }: CategoryStatusBadgeProps) {
  const memoizedGetStatusColor = useCallback(getStatusColor, []);
  const memoizedGetStatusText = useCallback(getStatusText, []);

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${memoizedGetStatusColor(status)}`}>
      {memoizedGetStatusText(status)}
    </span>
  );
} 