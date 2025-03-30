"use client";

import React, { memo } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/authContext";
import { CustomerProvider } from "./context/customerContext";
import { CartProvider } from "./context/cartContext";

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
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#4aed88",
                  secondary: "#fff",
                },
              },
            }}
          />
        </CartProvider>
      </CustomerProvider>
    </AuthProvider>
  );
});

export { Providers }; 