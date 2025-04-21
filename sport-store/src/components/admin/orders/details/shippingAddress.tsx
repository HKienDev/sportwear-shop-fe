"use client";

import { Home, Phone, User } from "lucide-react";

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
            <p className="text-gray-600 break-words">{address}</p>
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