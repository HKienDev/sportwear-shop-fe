"use client";

import { createContext, useState, useContext } from "react";

export enum ShippingMethod {
  STANDARD = "standard",
  EXPRESS = "express",
  SAME_DAY = "same_day"
}

interface ShippingMethodContextType {
  shippingMethod: ShippingMethod;
  setShippingMethod: (method: ShippingMethod) => void;
}

const ShippingMethodContext = createContext<ShippingMethodContextType | undefined>(undefined);

export function ShippingMethodProvider({ children }: { children: React.ReactNode }) {
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(ShippingMethod.STANDARD);

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