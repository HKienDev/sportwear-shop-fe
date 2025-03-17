"use client";

import { useState } from "react";
import CustomerInfo from "@/components/orders/add/customerInfo";
import OrderPreview from "@/components/orders/add/orderPreview";
import OrderProducts from "@/components/orders/add/orderProducts";
import OrderActions from "@/components/orders/add/orderActions";
import { PaymentMethodProvider } from "@/app/context/paymentMethodContext";
import { ShippingMethodProvider } from "@/app/context/shippingMethodContext";
import { CartProvider } from "@/app/context/cartContext";
import { CustomerProvider } from "@/app/context/customerContext";
import { useRouter } from "next/navigation";

export default function AddOrderPage() {
  const router = useRouter();
  const [formKey, setFormKey] = useState(0);

  const handleResetForm = () => {
    setFormKey(prev => prev + 1);
  };

  const handleClose = () => {
    router.push("/admin/orders/list");
  };

  return (
    <CartProvider>
      <CustomerProvider>
        <PaymentMethodProvider>
          <ShippingMethodProvider>
            <div className="p-4 pt-20">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 sticky top-20 bg-white z-10 py-4 border-b">
                <h1 className="text-2xl font-bold">THÊM ĐƠN HÀNG</h1>
                <OrderActions
                  onClose={handleClose}
                  onResetForm={handleResetForm}
                />
              </div>

              {/* Nội dung */}
              <div className="flex flex-col xl:flex-row gap-6 mt-6">
                {/* Cột trái */}
                <div className="w-full xl:w-[55%] 2xl:w-3/5 flex flex-col gap-6">
                  <CustomerInfo key={`customer-${formKey}`} />
                  <OrderPreview key={`preview-${formKey}`} />
                </div>

                {/* Cột phải */}
                <div className="w-full xl:w-[45%] 2xl:w-2/5">
                  <OrderProducts key={`products-${formKey}`} />
                </div>
              </div>
            </div>
          </ShippingMethodProvider>
        </PaymentMethodProvider>
      </CustomerProvider>
    </CartProvider>
  );
}