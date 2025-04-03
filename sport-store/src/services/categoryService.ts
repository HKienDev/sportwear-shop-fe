import { Category, CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest, CategoryQueryParams } from '../types/category';
import axiosInstance from '../config/axios';

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
  getCategoryById: async (id: string): Promise<CategoryResponse> => {
    try {
      const response = await axiosInstance.get(`/categories/${id}`);
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
  updateCategory: async (id: string, data: UpdateCategoryRequest): Promise<CategoryResponse> => {
    try {
      const response = await axiosInstance.put(`/categories/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa danh mục
  deleteCategory: async (id: string): Promise<CategoryResponse> => {
    try {
      const response = await axiosInstance.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default categoryService; 