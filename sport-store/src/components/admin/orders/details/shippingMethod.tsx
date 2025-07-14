"use client";

import { Truck, Calendar, Clock, Package } from "lucide-react";

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

  // Get shipping method color
  const getShippingMethodColor = (method: string) => {
    switch (method) {
      case "standard":
        return "from-blue-500 to-blue-600";
      case "express":
        return "from-purple-500 to-purple-600";
      case "same_day":
        return "from-red-500 to-red-600";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  const shippingMethodColor = getShippingMethodColor(shippingMethod);

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 text-lg">Phương Thức Vận Chuyển</h3>
          <p className="text-sm text-slate-600">Thông tin giao hàng</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-4">
        {/* Shipping Method */}
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
          <div className="bg-slate-200 p-2 rounded-lg">
            <Package className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-slate-500 mb-1">Phương thức</div>
            <div className="font-semibold text-slate-900">{method}</div>
            {shippingMethod && (
              <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${shippingMethodColor} text-white`}>
                {shippingMethodText}
              </div>
            )}
          </div>
        </div>
        
        {/* Order Date */}
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
          <div className="bg-slate-200 p-2 rounded-lg">
            <Calendar className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-slate-500 mb-1">Ngày đặt hàng</div>
            <div className="font-medium text-slate-900">
              {new Date(orderDate).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
        
        {/* Expected Delivery */}
        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
          <div className="bg-green-200 p-2 rounded-lg">
            <Clock className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-green-600 mb-1">Ngày dự kiến giao hàng</div>
            <div className="font-semibold text-green-800">{calculatedExpectedDate}</div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span>Phương thức vận chuyển đã được xác nhận</span>
        </div>
      </div>
    </div>
  );
}