import { BaseEntity } from "@/types/base";

export interface Coupon extends BaseEntity {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  description?: string;
  applicableProducts?: string[];
  applicableCategories?: string[];
  applicableUsers?: string[];
}

export interface CreateCouponData {
  code: string;
  type: Coupon['type'];
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  description?: string;
  applicableProducts?: string[];
  applicableCategories?: string[];
  applicableUsers?: string[];
}

export interface UpdateCouponData extends Partial<CreateCouponData> {
  id: string;
}

export interface CouponResponse {
  success: boolean;
  message?: string;
  data?: {
    coupon?: Coupon;
    coupons?: Coupon[];
    total?: number;
    page?: number;
    limit?: number;
  };
} 