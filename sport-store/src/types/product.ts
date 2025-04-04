export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  images: string[];
  specifications?: Record<string, string>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  message: string;
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
  name: string;
  slug: string;
  isActive: boolean;
}

export interface ProductFormState {
  data: ProductFormData;
  errors: ProductFormErrors;
  isLoading: boolean;
  isSubmitting: boolean;
  categories: Category[];
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
} 