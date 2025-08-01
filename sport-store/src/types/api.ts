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

// Question types
export interface Question {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
  };
  productSku: string;
  user: {
    _id: string;
    fullname: string;
    avatar: string;
    totalSpent: number;
  };
  userName: string;
  userAvatar: string;
  question: string;
  orderId?: string;
  orderShortId?: string;
  purchasedItem?: {
    sku: string;
    name: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
  };
  status: 'pending' | 'approved' | 'rejected';
  visibility: 'public' | 'private';
  isHelpful: number;
  isVerified: boolean;
  adminAnswer?: string;
  answeredAt?: string;
  answeredBy?: {
    _id: string;
    fullname: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface QuestionResponse {
  success: boolean;
  message: string;
  data: {
    questions: Question[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface CreateQuestionData {
  productSku: string;
  question: string;
}

export interface AdminQuestion {
  _id: string;
  question: string;
  answer?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  helpfulCount: number;
  isVerified: boolean;
  user: {
    _id: string;
    fullname: string;
    avatar?: string;
  };
  product: {
    _id: string;
    name: string;
    sku: string;
    images: string[];
  };
  orderShortId?: string;
  purchasedItem?: {
    sku: string;
    name: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
  };
}

export interface AdminQuestionResponse {
  success: boolean;
  message: string;
  data: {
    questions: AdminQuestion[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface AnswerQuestionData {
  answer: string;
}

export type { User, Order, CartItem } from './base';
export type { Product } from './product'; 