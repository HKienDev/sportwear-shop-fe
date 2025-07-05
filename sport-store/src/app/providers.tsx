"use client";

import React, { memo } from "react";
import { AuthProvider } from "../context/authContext";
import { CustomerProvider } from "../context/customerContext";
import { PaymentMethodProvider } from "../context/paymentMethodContext";
import { ShippingMethodProvider } from "../context/shippingMethodContext";
import { PromoProvider } from "../context/promoContext";
import { CartProvider } from "../context/cartContext";
import TokenManager from "../components/TokenManagerFixed";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = memo(function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <TokenManager>
        <CustomerProvider>
          <PaymentMethodProvider>
            <ShippingMethodProvider>
              <PromoProvider>
                <CartProvider>
                  {children}
                </CartProvider>
              </PromoProvider>
            </ShippingMethodProvider>
          </PaymentMethodProvider>
        </CustomerProvider>
      </TokenManager>
    </AuthProvider>
  );
});

export { Providers }; 