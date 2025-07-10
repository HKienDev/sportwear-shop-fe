import type { Category } from '@/types/category';
import type { ApiResponse } from '@/types/api';
import { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest, CategoryQueryParams } from '../types/category';
import { API_URL } from '@/utils/api';

// Tạo axios instance riêng cho public API calls (không cần authentication)
import axios from 'axios';

const publicApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CategoriesResponse {
  categories: Category[];
  total?: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const categoryService = {
  // Get all categories
  async getCategories(params?: any): Promise<ApiResponse<CategoriesResponse>> {
    try {
      const response = await publicApiClient.get('/categories', { params });
      
      // If response.data is an array, wrap it in categories property
      if (Array.isArray(response.data)) {
        return { success: true, data: { categories: response.data } };
      }
      
      // If response.data already has categories property, return as is
      if (response.data && response.data.data && response.data.data.categories) {
        // Pass through pagination if present
        return {
          success: response.data.success,
          data: {
            categories: response.data.data.categories,
            pagination: response.data.data.pagination
          }
        };
      }
      
      // If response.data has success and data properties
      if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
        const apiData = response.data.data;
        if (Array.isArray(apiData)) {
          return { success: response.data.success, data: { categories: apiData } };
        }
        if (apiData && (apiData as any).categories) {
          return { 
            success: response.data.success, 
            data: { 
              categories: (apiData as any).categories,
              pagination: (apiData as any).pagination
            } 
          };
        }
      }
      
      // Fallback
      return { success: false, data: { categories: [] } };
    } catch (error) {
      console.error('❌ categoryService.getCategories - Error:', error);
      throw error;
    }
  },

  // Get category by ID
  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    const response = await publicApiClient.get(`/categories/${id}`);
    return response.data as ApiResponse<Category>;
  },

  // Create category (requires authentication - use apiClient)
  async createCategory(categoryData: any): Promise<ApiResponse<Category>> {
    throw new Error('Create category requires authentication');
  },

  // Update category (requires authentication - use apiClient)
  async updateCategory(id: string, categoryData: any): Promise<ApiResponse<Category>> {
    throw new Error('Update category requires authentication');
  },

  // Delete category (requires authentication - use apiClient)
  async deleteCategory(id: string): Promise<ApiResponse<{ message: string }>> {
    throw new Error('Delete category requires authentication');
  },

  // Search categories by name
  async searchCategories(name: string): Promise<ApiResponse<CategoriesResponse>> {
    const response = await publicApiClient.get('/categories', { params: { search: name } });
    if (Array.isArray(response.data)) {
      return { success: true, data: { categories: response.data } };
    }
    if (response.data && response.data.data && response.data.data.categories) {
      return response.data as ApiResponse<CategoriesResponse>;
    }
    return { success: false, data: { categories: [] } };
  }
};

/**
 * Lấy danh sách tất cả categories
 * @returns Promise với danh sách categories
 */
export const getAllCategories = async (): Promise<ApiResponse<Category[]>> => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Lấy thông tin category theo ID
 * @param categoryId ID của category cần lấy
 * @returns Promise với thông tin category
 */
export const getCategoryById = async (categoryId: string): Promise<ApiResponse<Category>> => {
  try {
    const response = await fetch(`${API_URL}/categories/${categoryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

export default categoryService; 