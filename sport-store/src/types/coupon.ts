export interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  usageLimit: number;
  userLimit: number;
  // ISO 8601 format (UTC) - e.g. "2025-04-07T00:00:00Z"
  startDate: string;
  // ISO 8601 format (UTC) - e.g. "2025-05-07T23:59:59Z"
  endDate: string;
  status: 'active' | 'inactive' | 'expired';
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