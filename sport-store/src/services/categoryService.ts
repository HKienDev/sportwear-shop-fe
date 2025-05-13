import { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest, CategoryQueryParams } from '../types/category';
import axiosInstance from '../config/axios';
import { API_URL } from '@/utils/api';

const categoryService = {
  // Lấy tất cả danh mục
  getAllCategories: async (params?: CategoryQueryParams): Promise<CategoryResponse> => {
    try {
      const response = await axiosInstance.get('/categories', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tìm kiếm danh mục
  searchCategories: async (query: string): Promise<CategoryResponse> => {
    try {
      const response = await axiosInstance.get('/categories/search', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh mục theo ID
  getCategoryById: async (categoryId: string): Promise<CategoryResponse> => {
    try {
      const response = await axiosInstance.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo danh mục mới
  createCategory: async (data: CreateCategoryRequest): Promise<CategoryResponse> => {
    try {
      const response = await axiosInstance.post('/categories', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật danh mục
  updateCategory: async (categoryId: string, data: UpdateCategoryRequest): Promise<CategoryResponse> => {
    try {
      const response = await axiosInstance.put(`/categories/${categoryId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa danh mục
  deleteCategory: async (categoryId: string): Promise<CategoryResponse> => {
    try {
      const response = await axiosInstance.delete(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

/**
 * Lấy danh sách tất cả categories
 * @returns Promise với danh sách categories
 */
export const getAllCategories = async () => {
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
export const getCategoryById = async (categoryId: string) => {
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