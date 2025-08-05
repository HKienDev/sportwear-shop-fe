import { fetchApi } from '@/utils/api';
import { Brand, BrandFormData, BrandFilters } from '@/types/brand';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const adminBrandService = {
  // Lấy danh sách brands với filter
  async getBrands(filters: BrandFilters = {}, page: number = 1, limit: number = 10) {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await fetchApi(`/admin/brands?${params.toString()}`);
    return response;
  },

  // Lấy chi tiết brand
  async getBrand(id: string) {
    const response = await fetchApi(`/admin/brands/${id}`);
    return response;
  },

  // Tạo brand mới
  async createBrand(brandData: BrandFormData) {
    const response = await fetchApi(`/admin/brands`, {
      method: 'POST',
      body: JSON.stringify(brandData),
    });
    return response;
  },

  // Cập nhật brand
  async updateBrand(id: string, brandData: Partial<BrandFormData>) {
    const response = await fetchApi(`/admin/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(brandData),
    });
    return response;
  },

  // Xóa brand
  async deleteBrand(id: string) {
    const response = await fetchApi(`/admin/brands/${id}`, {
      method: 'DELETE',
    });
    return response;
  },

  // Xóa nhiều brands
  async deleteMultipleBrands(ids: string[]) {
    const response = await fetchApi(`/admin/brands/bulk-delete`, {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    return response;
  },

  // Toggle status brand
  async toggleBrandStatus(id: string) {
    const response = await fetchApi(`/admin/brands/${id}/toggle-status`, {
      method: 'PATCH',
    });
    return response;
  },

  // Upload logo brand
  async uploadBrandLogo(file: File) {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await fetchApi(`/admin/brands/upload-logo`, {
      method: 'POST',
      body: formData,
      requireAuth: true,
    });
    return response;
  },

  // Lấy thống kê brands
  async getBrandStats() {
    const response = await fetchApi(`/admin/brands/stats`);
    return response;
  },


}; 