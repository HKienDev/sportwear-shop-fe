import type { UserProduct } from '@/types/product';
import type { ApiResponse } from '@/types/api';

// Tạo axios instance riêng cho public API calls (không cần authentication)
import axios from 'axios';

const publicApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface UserProductsResponse {
  products: UserProduct[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ProductQueryParams {
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export const userProductService = {
  // Get all products for user
  async getProducts(params?: any): Promise<ApiResponse<UserProductsResponse>> {
    try {
      const response = await publicApiClient.get('/products', { params });
      
      // If response.data is an array, wrap it in products property
      if (Array.isArray(response.data)) {
        return { success: true, data: { products: response.data as UserProduct[] } };
      }
      
      // If response.data already has products property, return as is
      if (response.data && (response.data as any).products) {
        return { 
          success: response.data.success, 
          data: { 
            products: (response.data as any).products as UserProduct[],
            total: (response.data as any).total,
            page: (response.data as any).page,
            limit: (response.data as any).limit
          } 
        };
      }
      
      // If response.data has success and data properties
      if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
        const apiData = response.data.data;
        if (Array.isArray(apiData)) {
          return { success: response.data.success, data: { products: apiData as UserProduct[] } };
        }
        if (apiData && (apiData as any).products) {
          return { 
            success: response.data.success, 
            data: { 
              products: (apiData as any).products as UserProduct[],
              total: (apiData as any).total,
              page: (apiData as any).page,
              limit: (apiData as any).limit
            } 
          };
        }
      }
      
      // If response.data is the direct API response (from Next.js API route)
      if (response.data && typeof response.data === 'object' && 'success' in response.data) {
        if (response.data.success && response.data.data) {
          const apiData = response.data.data;
          if (Array.isArray(apiData)) {
            return { success: true, data: { products: apiData as UserProduct[] } };
          }
          if (apiData && (apiData as any).products) {
            return { 
              success: true, 
              data: { 
                products: (apiData as any).products as UserProduct[],
                total: (apiData as any).total,
                page: (apiData as any).page,
                limit: (apiData as any).limit
              } 
            };
          }
        }
      }
      
      // Fallback
      return { success: false, data: { products: [] } };
    } catch (error) {
      console.error('❌ userProductService.getProducts - Error:', error);
      throw error;
    }
  },

  // Get product by ID for user
  async getProductById(id: string): Promise<ApiResponse<UserProduct>> {
    const response = await publicApiClient.get(`/products/${id}`);
    return { 
      success: response.data.success, 
      data: response.data.data as unknown as UserProduct 
    };
  },

  // Get product by SKU for user
  async getProductBySku(sku: string): Promise<ApiResponse<UserProduct>> {
    // Use getProducts with SKU filter as fallback
    const response = await publicApiClient.get('/products', { params: { keyword: sku } });
    if (response.data && (response.data as any).products && (response.data as any).products.length > 0) {
      return { 
        success: true, 
        data: (response.data as any).products[0] as UserProduct 
      };
    }
    return { success: false, data: {} as UserProduct };
  },

  // Get products by category for user
  async getProductsByCategory(categoryId: string): Promise<ApiResponse<UserProductsResponse>> {
    return this.getProducts({ categoryId });
  },

  // Lấy danh sách sản phẩm theo danh mục với params
  async getProductsByCategoryWithParams(categoryId: string, params?: ProductQueryParams): Promise<ApiResponse<UserProductsResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await publicApiClient.get(`/products/category/${categoryId}?${queryParams.toString()}`);
      
      // Xử lý response tương tự như getProducts
      if (response.data && (response.data as any).products) {
        return { 
          success: response.data.success, 
          data: { 
            products: (response.data as any).products as UserProduct[],
            total: (response.data as any).total,
            page: (response.data as any).page,
            limit: (response.data as any).limit
          } 
        };
      }
      
      return { success: false, data: { products: [] } };
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },
}; 