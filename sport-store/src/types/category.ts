export interface Category {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  isActive: boolean;
  productCount: number;
  createdBy: {
    _id: string;
    name: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  image: string;
  isActive: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image: string;
  isActive?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: {
    category?: Category;
    categories?: Category[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  sort?: string;
  order?: string;
  _t?: number;
}

export interface CategoryListResponse {
  success: boolean;
  message: string;
  data: {
    categories: Category[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface SingleCategoryResponse {
  success: boolean;
  message: string;
  data: Category;
} 