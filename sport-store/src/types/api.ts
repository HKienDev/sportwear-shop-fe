import type { User, Order, CartItem } from './base';
import type { Product } from './product';
import type { LoginResponse, AuthCheckResponse, TokenVerifyResponse, ProfileResponse, GoogleAuthResponse, EmptyResponse } from './auth';

export type ApiResponseData = 
    | User 
    | User[] 
    | Product 
    | Product[] 
    | Order 
    | Order[] 
    | CartItem 
    | CartItem[]
    | LoginResponse['data']
    | AuthCheckResponse['user']
    | TokenVerifyResponse['data']
    | ProfileResponse['data']
    | GoogleAuthResponse['data']
    | EmptyResponse['data']
    | { url: string }
    | null
    | undefined;

export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data: T;
    error?: string;
}

export interface ApiError {
    message: string;
    code?: string;
    status?: number;
    details?: Record<string, unknown>;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    items?: T[];
    products?: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ProductQueryParams extends PaginationParams {
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
}

export interface OrderQueryParams extends PaginationParams {
    userId?: string;
    status?: Order['status'];
    paymentStatus?: Order['paymentStatus'];
    startDate?: string;
    endDate?: string;
    phone?: string;
}

export type { User, Order, CartItem } from './base';
export type { Product } from './product'; 