"use client";

import { createContext, useState, useContext } from "react";

interface PaymentMethodContextType {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PaymentMethodContext = createContext<PaymentMethodContextType | undefined>(undefined);

export function PaymentMethodProvider({ children }: { children: React.ReactNode }) {
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Mặc định là COD

  return (
    <PaymentMethodContext.Provider value={{ paymentMethod, setPaymentMethod }}>
      {children}
    </PaymentMethodContext.Provider>
  );
}

export function usePaymentMethod() {
  const context = useContext(PaymentMethodContext);
  if (!context) {
    throw new Error("usePaymentMethod must be used within a PaymentMethodProvider");
  }
  return context;
}