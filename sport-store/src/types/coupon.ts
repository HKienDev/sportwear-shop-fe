export interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number;
  usageCount: number;
  minimumPurchaseAmount?: number;
  createdAt: string;
  updatedAt: string;
} 