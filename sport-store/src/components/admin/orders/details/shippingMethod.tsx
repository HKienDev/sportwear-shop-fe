"use client";

import { Truck } from "lucide-react";

interface ShippingMethodProps {
  method: string;
  shortId: string;
  shippingMethod: string;
  createdAt?: string;
}

export default function ShippingMethod({
  method,
  shortId,
  shippingMethod,
  createdAt
}: ShippingMethodProps) {
  // Hàm chuyển đổi phương thức giao hàng
  const getShippingMethodText = (method: string) => {
    switch (method) {
      case "standard":
        return "GIAO HÀNG TIẾT KIỆM";
      case "express":
        return "GIAO HÀNG NHANH";
      case "same_day":
        return "GIAO HÀNG HỎA TỐC";
      default:
        return method.toUpperCase();
    }
  };

  // Hàm tính ngày dự kiến giao hàng
  const calculateExpectedDate = (method: string, orderDate: string) => {
    const orderDateObj = new Date(orderDate);
    let daysToAdd = 0;

    switch (method) {
      case "standard":
        daysToAdd = 5;
        break;
      case "express":
        daysToAdd = 2;
        break;
      case "same_day":
        daysToAdd = 0;
        break;
      default:
        daysToAdd = 5;
    }

    const expectedDateObj = new Date(orderDateObj);
    expectedDateObj.setDate(expectedDateObj.getDate() + daysToAdd);

    return expectedDateObj.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Lấy ngày tạo đơn từ createdAt hoặc shortId
  const getOrderDate = () => {
    if (createdAt) {
      return createdAt;
    }
    
    // Fallback: Lấy từ shortId nếu không có createdAt
    const parts = shortId.split("-");
    if (parts.length >= 3) {
      const dateStr = parts[2];
      if (dateStr && dateStr.length === 8) {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `${year}-${month}-${day}`;
      }
    }
    return new Date().toISOString().split("T")[0]; // Fallback to current date
  };

  const orderDate = getOrderDate();
  const calculatedExpectedDate = calculateExpectedDate(shippingMethod, orderDate);
  const shippingMethodText = getShippingMethodText(shippingMethod);

  return (
    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4">
      <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
        <Truck className="w-5 h-5" />
        Phương Thức Vận Chuyển
      </h3>
      <div className="text-sm">
        <div className="font-semibold text-gray-900">{method}</div>
        {shippingMethod && (
          <div className="text-gray-600 mt-1">Phương thức: {shippingMethodText}</div>
        )}
        <div className="text-gray-600 mt-1">Ngày dự kiến giao hàng: {calculatedExpectedDate}</div>
      </div>
    </div>
  );
}