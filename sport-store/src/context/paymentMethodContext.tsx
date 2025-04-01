"use client";

import { createContext, useState, useContext } from "react";

export enum PaymentMethod {
  COD = "COD",
  BANKING = "BANKING",
  MOMO = "MOMO"
}

interface PaymentMethodContextType {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
}

const PaymentMethodContext = createContext<PaymentMethodContextType | undefined>(undefined);

export function PaymentMethodProvider({ children }: { children: React.ReactNode }) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);

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