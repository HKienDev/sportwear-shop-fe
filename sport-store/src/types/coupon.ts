export interface Coupon {
  _id: string;
  code: string;
  type: string;
  value: number;
  usageLimit: number;
  userLimit: number;
  startDate: string;
  endDate: string;
  status: string;
  usageCount: number;
  userUsageCount: Record<string, number>;
  minimumPurchaseAmount: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  isExpired?: boolean;
  isAvailable?: boolean;
} 