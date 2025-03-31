"use client";

import { useState } from "react";
import CustomerInfo from "@/components/admin/orders/add/customerInfo";
import OrderPreview from "@/components/admin/orders/add/orderPreview";
import OrderProducts from "@/components/admin/orders/add/orderProducts";
import OrderActions from "@/components/admin/orders/add/orderActions";
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

  return (
    <div className="space-y-6">
      <CartProvider>
        <CustomerProvider>
          <PaymentMethodProvider>
            <ShippingMethodProvider>
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white rounded-lg shadow-sm p-6 relative z-10">
                  <h1 className="text-2xl font-bold">THÊM ĐƠN HÀNG</h1>
                  <div className="flex items-center gap-4">
                    <OrderActions onClose={() => router.push("/admin/orders/list")} onResetForm={handleResetForm} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <CustomerInfo key={`customer-${formKey}`} />
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <OrderProducts key={`products-${formKey}`} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <OrderPreview key={`preview-${formKey}`} />
                </div>
              </div>
            </ShippingMethodProvider>
          </PaymentMethodProvider>
        </CustomerProvider>
      </CartProvider>
    </div>
  );
}