"use client";

import { Home, Phone, User } from "lucide-react";

interface ShippingAddressProps {
  name: string;
  address: string;
  phone: string;
  city: string;
  district?: string;
  ward?: string;
  postalCode?: string;
}

export default function ShippingAddress({
  name,
  address,
  phone,
  city,
  district,
  ward,
  postalCode,
}: ShippingAddressProps) {
  // Tạo chuỗi địa chỉ đầy đủ
  const fullAddress = [
    address,
    ward,
    district,
    city,
    postalCode
  ]
    .filter(Boolean) // Lọc bỏ các giá trị undefined hoặc null
    .join(", ");

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Home className="w-5 h-5" />
        Địa Chỉ Giao Hàng
      </h3>
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <User className="w-5 h-5 text-gray-500 mt-1" />
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-gray-600 break-words">{fullAddress}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">{phone}</span>
        </div>
      </div>
    </div>
  );
}