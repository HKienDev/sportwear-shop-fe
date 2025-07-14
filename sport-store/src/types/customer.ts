import type { Gender, UserRole, MembershipLevel, AuthStatus } from './base';
import { Address } from './location';

export interface Customer {
  _id: string;
  fullname: string;
  avatar: string;
  phone: string;
  address: Address;
  totalOrders?: number;
  totalSpent?: number;
  createdAt: string;
  updatedAt: string | Date;
  isActive: boolean;
  role?: string;
  email?: string;
  deliveredOrders?: number;
  customId?: string;
  // Thống kê thực tế (bao gồm đơn hàng theo phone)
  realOrderCount?: number;
  realTotalSpent?: number;
  realDeliveredOrders?: number;
}

export interface CustomerResponse {
  success: boolean;
  message?: string;
  data: {
    customers: Customer[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface CustomerSearchParams {
  query?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CustomerCreateInput {
  fullname: string;
  email: string;
  phone: string;
  address: {
    province: string;
    district: string;
    ward: string;
    street: string;
  };
  gender: Gender;
  role: UserRole;
  membershipLevel: MembershipLevel;
  points: number;
  authStatus: AuthStatus;
  isActive?: boolean;
}

export interface CustomerUpdateInput {
  fullname?: string;
  email?: string;
  phone?: string;
  address?: {
    province?: string;
    district?: string;
    ward?: string;
    street?: string;
  };
  gender?: Gender;
  role?: UserRole;
  membershipLevel?: MembershipLevel;
  points?: number;
  authStatus?: AuthStatus;
  isActive?: boolean;
}

export type CustomerUpdateField = 
  | "fullname" 
  | "phone" 
  | "avatar" 
  | "address" 
  | "isActive";

export type CustomerUpdateValue = 
  | string 
  | boolean 
  | Address; 