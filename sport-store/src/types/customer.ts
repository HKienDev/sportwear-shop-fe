import type { User, Gender, UserRole, MembershipLevel, AuthStatus } from './base';

export interface Customer extends User {
  isActive: boolean;
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