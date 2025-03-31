"use client";

import { createContext, useState, useContext } from "react";

interface ShippingMethodContextType {
  shippingMethod: string;
  setShippingMethod: (method: string) => void;
}

const ShippingMethodContext = createContext<ShippingMethodContextType | undefined>(undefined);

export function ShippingMethodProvider({ children }: { children: React.ReactNode }) {
  const [shippingMethod, setShippingMethod] = useState("Standard"); // Mặc định là Standard

  return (
    <ShippingMethodContext.Provider value={{ shippingMethod, setShippingMethod }}>
      {children}
    </ShippingMethodContext.Provider>
  );
}

export function useShippingMethod() {
  const context = useContext(ShippingMethodContext);
  if (!context) {
    throw new Error("useShippingMethod must be used within a ShippingMethodProvider");
  }
  return context;
} 