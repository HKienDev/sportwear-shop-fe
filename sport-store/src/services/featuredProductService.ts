import type { FeaturedProduct } from '@/types/product';
import type { ApiResponse } from '@/types/api';

export interface FeaturedProductsResponse {
  products: FeaturedProduct[];
  count: number;
}

export const featuredProductService = {
  // Lấy danh sách sản phẩm nổi bật
  async getFeaturedProducts(limit: number = 6): Promise<ApiResponse<FeaturedProductsResponse>> {
    try {
      // Gọi trực tiếp Next.js API route
      const response = await fetch(`/api/products/featured?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Thêm cache để tối ưu hiệu suất
        next: { revalidate: 300 }, // Cache trong 5 phút
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ FeaturedProductService - Error fetching featured products:', error);
      throw error;
    }
  }
}; 