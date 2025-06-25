"use client";

import React, { memo } from "react";
import { AuthProvider } from "../context/authContext";
import { CustomerProvider } from "../context/customerContext";
import { CartProvider } from "../context/cartContext";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = memo(function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <CustomerProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </CustomerProvider>
    </AuthProvider>
  );
});

export { Providers }; 