'use client';

import { AuthProvider } from "@/context/authContext";
import { CartProvider } from "@/context/cartContext";
import { CustomerProvider } from "@/context/customerContext";
import { PaymentMethodProvider } from "@/context/paymentMethodContext";
import { ShippingMethodProvider } from "@/context/shippingMethodContext";
import { PromoProvider } from "@/context/promoContext";
import { Toaster } from "@/components/ui/toast";

interface ClientLayoutProps {
  children: React.ReactNode;
  fontClass: string;
}

export default function ClientLayout({ children, fontClass }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <CustomerProvider>
          <PaymentMethodProvider>
            <ShippingMethodProvider>
              <PromoProvider>
                {children}
                <Toaster />
              </PromoProvider>
            </ShippingMethodProvider>
          </PaymentMethodProvider>
        </CustomerProvider>
      </CartProvider>
    </AuthProvider>
  );
} 