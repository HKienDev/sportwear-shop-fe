"use client";

import React, { memo } from "react";
import { Toaster } from "sonner";
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
          <Toaster
            position="top-right"
            duration={3000}
            richColors
            closeButton
            expand={false}
          />
        </CartProvider>
      </CustomerProvider>
    </AuthProvider>
  );
});

export { Providers }; 