"use client";

import React, { memo } from "react";
import { AuthProvider } from "../context/authContext";
import { CustomerProvider } from "../context/customerContext";
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
          <CartProvider>
            {children}
          </CartProvider>
        </CustomerProvider>
      </TokenManager>
    </AuthProvider>
  );
});

export { Providers }; 