"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CouponWithDiscount {
  _id: string;
  code: string;
  type: string;
  value: number;
  minimumPurchaseAmount: number;
  startDate: string;
  endDate: string;
  status: string;
  usageCount: number;
  usageLimit: number;
  discountAmount: number;
}

interface PromoContextType {
  promoDetails: CouponWithDiscount | null;
  setPromoDetails: (details: CouponWithDiscount | null) => void;
}

const PromoContext = createContext<PromoContextType | undefined>(undefined);

export function PromoProvider({ children }: { children: ReactNode }) {
  const [promoDetails, setPromoDetails] = useState<CouponWithDiscount | null>(null);

  return (
    <PromoContext.Provider value={{ promoDetails, setPromoDetails }}>
      {children}
    </PromoContext.Provider>
  );
}

export function usePromo() {
  const context = useContext(PromoContext);
  if (context === undefined) {
    throw new Error("usePromo must be used within a PromoProvider");
  }
  return context;
} 