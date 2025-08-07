import { apiClient } from '@/lib/apiClient';
import type { AdminProduct, ProductQueryParams, ProductFormData } from '@/types/product';
import type { ApiResponse } from '@/types/api';

export interface AdminProductsResponse {
  products: AdminProduct[];
  total?: number;
  page?: number;
  limit?: number;
}

// Interface cho raw product data từ API
interface RawProduct {
  _id?: string;
  name?: string;
  description?: string;
  originalPrice?: number;
  salePrice?: number;
  price?: number;
  stock?: number;
  categoryId?: string;
  category?: string;
  brand?: string;
  mainImage?: string;
  subImages?: string[];
  images?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isActive?: boolean;
  sku?: string;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  rating?: number;
  ratings?: {
    average?: number;
    count?: number;
  };
  numReviews?: number;
  soldCount?: number;
  viewCount?: number;
  discountPercentage?: number;
  isOutOfStock?: boolean;
  isLowStock?: boolean;
  status?: string;
  isFeatured?: boolean;
}

function toAdminProduct(product: unknown): AdminProduct {
  const rawProduct = product as RawProduct;
  
  return {
    _id: rawProduct._id || '',
    name: rawProduct.name || '',
    description: rawProduct.description || '',
    originalPrice: rawProduct.originalPrice ?? rawProduct.price ?? 0,
    salePrice: rawProduct.salePrice ?? rawProduct.price ?? 0,
    stock: rawProduct.stock ?? 0,
    categoryId: rawProduct.categoryId ?? rawProduct.category ?? '',
    brand: rawProduct.brand ?? '',
    mainImage: rawProduct.mainImage ?? (Array.isArray(rawProduct.images) ? rawProduct.images[0] : '') ?? '',
    subImages: rawProduct.subImages ?? rawProduct.images ?? [],
    createdAt: typeof rawProduct.createdAt === 'string' ? rawProduct.createdAt : (rawProduct.createdAt ? new Date(rawProduct.createdAt).toISOString() : new Date().toISOString()),
    updatedAt: typeof rawProduct.updatedAt === 'string' ? rawProduct.updatedAt : (rawProduct.updatedAt ? new Date(rawProduct.updatedAt).toISOString() : new Date().toISOString()),
    isActive: rawProduct.isActive ?? true,
    sku: rawProduct.sku ?? '',
    colors: rawProduct.colors ?? [],
    sizes: rawProduct.sizes ?? [],
    tags: rawProduct.tags ?? [],
    rating: rawProduct.rating ?? (rawProduct.ratings?.average ?? 0),
    numReviews: rawProduct.numReviews ?? (rawProduct.ratings?.count ?? 0),
    soldCount: rawProduct.soldCount ?? 0,
    viewCount: rawProduct.viewCount ?? 0,
    discountPercentage: rawProduct.discountPercentage ?? 0,
    isOutOfStock: rawProduct.isOutOfStock ?? false,
    isLowStock: rawProduct.isLowStock ?? false,
    status: rawProduct.status || '',
    isFeatured: rawProduct.isFeatured ?? false,
  };
}

export const adminProductService = {
  // Get all products for admin
  async getProducts(params?: unknown): Promise<ApiResponse<AdminProductsResponse>> {
    // Đảm bảo luôn gọi admin endpoint bằng cách set limit >= 1000
    const adminParams = {
      ...(params as ProductQueryParams),
      limit: 1000 // Force admin request
    };
    
    const response = await apiClient.getProducts(adminParams);
    if (response.data && (response.data as unknown as { products?: unknown }).products) {
      const products = (response.data as unknown as { products?: unknown[] }).products?.map(toAdminProduct) || [];
      return {
        success: response.data.success,
        data: {
          products,
          total: (response.data as unknown as { total?: number }).total,
          page: (response.data as unknown as { page?: number }).page,
          limit: (response.data as unknown as { limit?: number }).limit
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
  async createProduct(productData: unknown): Promise<ApiResponse<AdminProduct>> {
    const response = await apiClient.createProduct(productData as ProductFormData);
    return {
      success: response.data.success,
      data: toAdminProduct(response.data.data)
    };
  },

  // Update product for admin
  async updateProduct(id: string, productData: unknown): Promise<ApiResponse<AdminProduct>> {
    const response = await apiClient.updateProduct(id, productData as ProductFormData);
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