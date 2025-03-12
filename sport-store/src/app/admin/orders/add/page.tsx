"use client";

import CustomerInfo from "@/components/Orders/CustomerInfo";
import OrderPreview from "@/components/Orders/OrderPreview";
import OrderProducts from "@/components/Orders/OrderProducts";
import OrderActions from "@/components/Orders/OrderActions"; // Import OrderActions
import { PaymentMethodProvider } from "@/app/context/PaymentMethodContext"; // Import PaymentMethodProvider

export default function AddOrderPage() {
  return (
    <PaymentMethodProvider> {/* Bọc trong PaymentMethodProvider */}
      <div className="p-6">
        {/* Header: Tiêu đề + Buttons */}
        <div className="flex justify-between items-center mb-6">
          {/* Tiêu đề */}
          <h1 className="text-2xl font-bold">THÊM ĐƠN HÀNG</h1>

          {/* Buttons */}
          <OrderActions />
        </div>

        {/* Nội dung chính */}
        <div className="flex gap-6 mt-6 items-start">
          {/* Phần bên trái: Thông tin khách hàng và xem trước đơn hàng */}
          <div className="w-1/2 flex flex-col gap-6">
            <CustomerInfo />
            <OrderPreview />
          </div>

          {/* Phần bên phải: Chọn sản phẩm */}
          <OrderProducts />
        </div>
      </div>
    </PaymentMethodProvider>
  );
}