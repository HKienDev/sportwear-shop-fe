import { apiClient } from '@/lib/apiClient';
import type { Product } from '@/types/product';
import type { ApiResponse } from '@/types/api';

export interface ProductsResponse {
  products: Product[];
  total?: number;
  page?: number;
  limit?: number;
}

export const productService = {
  // Get all products
  async getProducts(params?: any): Promise<ApiResponse<ProductsResponse>> {
    const response = await apiClient.getProducts(params);
    // If response.data is an array, wrap it in products property
    if (Array.isArray(response.data)) {
      return { success: true, data: { products: response.data } };
    }
    // If response.data already has products property, return as is
    if (response.data && (response.data as any).products) {
      return response.data as ApiResponse<ProductsResponse>;
    }
    // Fallback
    return { success: false, data: { products: [] } };
  },

  // Get product by ID
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    const response = await apiClient.getProductById(id);
    return response.data as ApiResponse<Product>;
  },

  // Create product
  async createProduct(productData: any): Promise<ApiResponse<Product>> {
    const response = await apiClient.createProduct(productData);
    return response.data as ApiResponse<Product>;
  },

  // Update product
  async updateProduct(id: string, productData: any): Promise<ApiResponse<Product>> {
    const response = await apiClient.updateProduct(id, productData);
    return response.data as ApiResponse<Product>;
  },

  // Delete product
  async deleteProduct(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.deleteProduct(id);
    // Nếu response.data là object có message thì trả về, nếu không thì trả về message mặc định
    if (response.data && typeof response.data === 'object' && 'message' in response.data) {
      return response.data as unknown as ApiResponse<{ message: string }>;
    }
    return { success: true, data: { message: 'Xóa sản phẩm thành công' } };
  },

  // Get products by category
  async getProductsByCategory(categoryId: string): Promise<ApiResponse<ProductsResponse>> {
    return this.getProducts({ categoryId });
  }
}; 