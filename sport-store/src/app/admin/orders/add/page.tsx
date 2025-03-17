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
            <div className="p-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">THÊM ĐƠN HÀNG</h1>
                <OrderActions
                  onClose={handleClose}
                  onResetForm={handleResetForm}
                />
              </div>

              {/* Nội dung */}
              <div className="flex gap-6 mt-6 items-start">
                {/* Cột trái */}
                <div className="w-1/2 flex flex-col gap-6">
                  {/* Thêm tiền tố unique cho key */}
                  <CustomerInfo key={`customer-${formKey}`} /> 
                  <OrderPreview key={`preview-${formKey}`} />
                </div>

                {/* Cột phải */}
                <OrderProducts key={`products-${formKey}`} />
              </div>
            </div>
          </ShippingMethodProvider>
        </PaymentMethodProvider>
      </CustomerProvider>
    </CartProvider>
  );
}