"use client";

import { Truck } from "lucide-react";

interface ShippingMethodProps {
  method: string;
  expectedDate: string;
  courier: string;
  trackingId: string;
  shortId: string;
  shippingMethod?: string;
}

export default function ShippingMethod({
  method,
  expectedDate,
  courier,
  trackingId,
  shortId,
  shippingMethod
}: ShippingMethodProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5" />
        Phương Thức Vận Chuyển
      </h3>
      <div className="space-y-3">
        <div>
          <p className="font-medium">{method}</p>
          {shippingMethod && (
            <p className="text-gray-600 mt-1">Phương thức: {shippingMethod}</p>
          )}
        </div>
        <div>
          <p className="text-gray-600">{expectedDate}</p>
        </div>
        <div>
          <p className="text-gray-600">Đơn vị vận chuyển: {courier}</p>
        </div>
        <div>
          <p className="text-gray-600">Mã vận đơn: {shortId}</p>
        </div>
      </div>
    </div>
  );
}