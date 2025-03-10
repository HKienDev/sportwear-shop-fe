"use client";

import CustomerInfo from "@/components/Orders/CustomerInfo";
import OrderPreview from "@/components/Orders/OrderPreview";
import OrderProducts from "@/components/Orders/OrderProducts";

export default function AddOrderPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">THÊM ĐƠN HÀNG</h1>

      <div className="flex gap-6 mt-6 items-start">
        <div className="w-1/2 flex flex-col gap-6">
          <CustomerInfo />
          <OrderPreview />
        </div>
        <OrderProducts />
      </div>
    </div>
  );
}