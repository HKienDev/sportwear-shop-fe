import type { User } from './base';

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
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive?: boolean;
}

export interface CustomerUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
} 