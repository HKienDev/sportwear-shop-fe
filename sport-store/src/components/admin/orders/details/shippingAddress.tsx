"use client";

import { Home, User, Phone, MapPin } from "lucide-react";

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
    <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
          <Home className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 text-lg">Địa Chỉ Giao Hàng</h3>
          <p className="text-sm text-slate-600">Thông tin người nhận</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-4">
        {/* Customer Name */}
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
          <div className="bg-slate-200 p-2 rounded-lg">
            <User className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-slate-500 mb-1">Người nhận</div>
            <div className="font-semibold text-slate-900">{name}</div>
          </div>
        </div>
        
        {/* Address */}
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
          <div className="bg-slate-200 p-2 rounded-lg">
            <MapPin className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-slate-500 mb-1">Địa chỉ</div>
            <div className="font-medium text-slate-900 leading-relaxed">{address}</div>
          </div>
        </div>
        
        {/* Phone */}
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
          <div className="bg-slate-200 p-2 rounded-lg">
            <Phone className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-slate-500 mb-1">Số điện thoại</div>
            <div className="font-semibold text-slate-900">{phone}</div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>Địa chỉ giao hàng đã được xác nhận</span>
        </div>
      </div>
    </div>
  );
}