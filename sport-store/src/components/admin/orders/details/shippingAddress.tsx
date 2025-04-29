"use client";

import { Home } from "lucide-react";

interface ShippingAddressProps {
  name: string;
  address: string;
  phone: string;
}

export default function ShippingAddress({
  name,
  address,
  phone,
}: ShippingAddressProps) {
  return (
    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4">
      <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
        <Home className="w-5 h-5" />
        Địa Chỉ Giao Hàng
      </h3>
      <div className="text-sm">
        <div className="font-semibold text-gray-900">{name}</div>
        <div className="text-gray-600 mt-1">{address}</div>
        <div className="text-gray-600 mt-1">{phone}</div>
      </div>
    </div>
  );
}