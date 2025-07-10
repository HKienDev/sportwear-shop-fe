import type { Category as BaseCategory } from './base';

// Basic Product interface (from base.ts)
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Extended Product interface for admin
export interface AdminProduct {
  _id: string;
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  categoryId: string;
  brand: string;
  mainImage: string;
  subImages: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isFeatured: boolean;
  sku: string;
  colors: string[];
  sizes: string[];
  tags: string[];
  rating: number;
  numReviews: number;
  viewCount: number;
  soldCount: number;
  discountPercentage: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
  status?: string;
}

// Extended Product interface for user-facing components
export interface UserProduct {
  _id: string;
  name: string;
  description: string;
  brand: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  categoryId: string;
  isActive: boolean;
  mainImage: string;
  subImages: string[];
  colors: string[];
  sizes: string[];
  sku: string;
  tags: string[];
  rating: number;
  numReviews: number;
  viewCount: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
  discountPercentage?: number;
  isOutOfStock?: boolean;
  isLowStock?: boolean;
}

// Extended Category interface for admin
export interface AdminCategory {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  isActive: boolean;
  hasProducts?: boolean;
}

export interface ProductWithCategory extends UserProduct {
  category: BaseCategory;
}

export interface Review {
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ProductQueryParams {
  keyword?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface SingleProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface ProductFormData {
  name: string;
  slug: string;
  sku: string;
  description: string;
  brand: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  categoryId: string;
  mainImage: string | null;
  subImages: string[];
  colors: string[];
  sizes: string[];
  tags: string[];
  specifications?: {
    material?: string;
    weight?: string;
    stretch?: string;
    absorbency?: string;
    warranty?: string;
    origin?: string;
    fabricTechnology?: string;
    careInstructions?: string;
  };
  isActive: boolean;
}

export interface ProductFormErrors {
  name?: string;
  description?: string;
  brand?: string;
  originalPrice?: string;
  salePrice?: string;
  stock?: string;
  categoryId?: string;
  mainImage?: string;
  subImages?: string;
  colors?: string;
  sizes?: string;
  tags?: string;
}

export interface Category {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface ProductFormState {
  data: ProductFormData;
  errors: ProductFormErrors;
  isLoading: boolean;
  isSubmitting: boolean;
  categories: AdminCategory[];
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

export interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  sold: number;
  total: number;
  rating: number;
  image?: string;
  sku: string;
  brand: string;
  category: string;
} 