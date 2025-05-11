import React, { useCallback } from "react";

export function getStatusColor(isActive: boolean, stock: number): string {
  if (!isActive) {
    return "text-red-500 bg-red-50 border border-red-200"; // Ngừng bán
  }
  
  if (stock <= 0) {
    return "text-red-500 bg-red-50 border border-red-200"; // Hết hàng
  }
  
  if (stock <= 10) {
    return "text-yellow-500 bg-yellow-50 border border-yellow-200"; // Sắp hết
  }
  
  return "text-green-500 bg-green-50 border border-green-200"; // Đang bán
}

export function getStatusText(isActive: boolean, stock: number): string {
  if (!isActive) {
    return "Ngừng bán";
  }
  
  if (stock <= 0) {
    return "Hết hàng";
  }
  
  if (stock <= 10) {
    return "Sắp hết";
  }
  
  return "Đang bán";
}

interface ProductStatusBadgeProps {
  isActive: boolean;
  stock: number;
}

export default function ProductStatusBadge({ isActive, stock }: ProductStatusBadgeProps) {
  const memoizedGetStatusColor = useCallback(getStatusColor, []);
  const memoizedGetStatusText = useCallback(getStatusText, []);

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${memoizedGetStatusColor(isActive, stock)}`}>
      {memoizedGetStatusText(isActive, stock)}
    </span>
  );
} 