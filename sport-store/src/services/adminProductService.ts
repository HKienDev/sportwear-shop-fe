import { apiClient } from '@/lib/apiClient';
import type { AdminProduct } from '@/types/product';
import type { ApiResponse } from '@/types/api';

export interface AdminProductsResponse {
  products: AdminProduct[];
  total?: number;
  page?: number;
  limit?: number;
}

function toAdminProduct(product: any): AdminProduct {
  return {
    _id: product._id,
    name: product.name,
    description: product.description,
    originalPrice: product.originalPrice ?? product.price ?? 0,
    salePrice: product.salePrice ?? product.price ?? 0,
    stock: product.stock ?? 0,
    categoryId: product.categoryId ?? product.category ?? '',
    brand: product.brand ?? '',
    mainImage: product.mainImage ?? (Array.isArray(product.images) ? product.images[0] : '') ?? '',
    subImages: product.subImages ?? product.images ?? [],
    createdAt: typeof product.createdAt === 'string' ? product.createdAt : (product.createdAt ? new Date(product.createdAt).toISOString() : new Date().toISOString()),
    updatedAt: typeof product.updatedAt === 'string' ? product.updatedAt : (product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString()),
    isActive: product.isActive ?? true,
    sku: product.sku ?? '',
    colors: product.colors ?? [],
    sizes: product.sizes ?? [],
    tags: product.tags ?? [],
    rating: product.rating ?? (product.ratings?.average ?? 0),
    numReviews: product.numReviews ?? (product.ratings?.count ?? 0),
    soldCount: product.soldCount ?? 0,
    viewCount: product.viewCount ?? 0,
    discountPercentage: product.discountPercentage ?? 0,
    isOutOfStock: product.isOutOfStock ?? false,
    isLowStock: product.isLowStock ?? false,
    status: product.status,
    isFeatured: product.isFeatured ?? false,
  };
}

export const adminProductService = {
  // Get all products for admin
  async getProducts(params?: any): Promise<ApiResponse<AdminProductsResponse>> {
    const response = await apiClient.getProducts(params);
    if (response.data && (response.data as any).products) {
      const products = (response.data as any).products.map(toAdminProduct);
      return {
        success: response.data.success,
        data: {
          products,
          total: (response.data as any).total,
          page: (response.data as any).page,
          limit: (response.data as any).limit
        }
      };
    }
    return { success: false, data: { products: [] } };
  },

  // Get product by ID for admin
  async getProductById(id: string): Promise<ApiResponse<AdminProduct>> {
    const response = await apiClient.getProductById(id);
    if (response.data && response.data.data) {
      const adminProduct = toAdminProduct(response.data.data);
      return {
        success: response.data.success,
        data: adminProduct
      };
    }
    return { success: false, data: {} as AdminProduct };
  },

  // Create product for admin
  async createProduct(productData: any): Promise<ApiResponse<AdminProduct>> {
    const response = await apiClient.createProduct(productData);
    return {
      success: response.data.success,
      data: toAdminProduct(response.data.data)
    };
  },

  // Update product for admin
  async updateProduct(id: string, productData: any): Promise<ApiResponse<AdminProduct>> {
    const response = await apiClient.updateProduct(id, productData);
    return {
      success: response.data.success,
      data: toAdminProduct(response.data.data)
    };
  },

  // Delete product for admin
  async deleteProduct(id: string): Promise<ApiResponse<AdminProduct[]>> {
    const response = await apiClient.deleteProduct(id);
    return {
      success: response.data.success,
      data: Array.isArray(response.data.data) ? response.data.data.map(toAdminProduct) : []
    };
  }
}; 