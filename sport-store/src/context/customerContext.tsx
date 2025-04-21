"use client";

import { createContext, useContext, useState, useCallback } from "react";

export interface Location {
  code: string;
  name: string;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  street: string;
  province: Location | null;
  district: Location | null;
  ward: Location | null;
}

type CustomerValue = string | Location | null;

interface CustomerContextType {
  customer: CustomerInfo;
  updateCustomer: (field: keyof CustomerInfo, value: CustomerValue) => void;
  resetCustomer: () => void;
}

const initialCustomerState: CustomerInfo = {
  fullName: "",
  phone: "",
  street: "",
  province: null,
  district: null,
  ward: null,
};

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerInfo>(initialCustomerState);

  const updateCustomer = useCallback((field: keyof CustomerInfo, value: CustomerValue) => {
    setCustomer((prev) => {
      let updatedCustomer = { ...prev, [field]: value };

      // Reset các trường phụ thuộc
      if (field === "province") {
        updatedCustomer = { ...updatedCustomer, district: null, ward: null };
      }

      if (field === "district") {
        updatedCustomer = { ...updatedCustomer, ward: null };
      }

      return updatedCustomer;
    });
  }, []);

  const resetCustomer = useCallback(() => {
    setCustomer(initialCustomerState);
  }, []);

  return (
    <CustomerContext.Provider value={{ customer, updateCustomer, resetCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
}