export interface Category {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  isFeatured: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  hasProducts: boolean;
}

export interface CategoryFormData {
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  isFeatured: boolean;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
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