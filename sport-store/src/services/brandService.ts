import { fetchApi } from '@/utils/api';
import { Brand } from '@/types/brand';

export const brandService = {
  // Lấy danh sách brands cho user (chỉ active)
  async getBrands() {
    const response = await fetchApi(`/brands`, { requireAuth: false });
    return response;
  },

  // Lấy chi tiết brand
  async getBrand(id: string) {
    const response = await fetchApi(`/brands/${id}`, { requireAuth: false });
    return response;
  },



  // Lấy brands featured
  async getFeaturedBrands() {
    const response = await fetchApi(`/brands/featured`, { requireAuth: false });
    return response;
  },

  // Lấy brands trending
  async getTrendingBrands() {
    const response = await fetchApi(`/brands/trending`, { requireAuth: false });
    return response;
  },

  // Lấy brands premium
  async getPremiumBrands() {
    const response = await fetchApi(`/brands/premium`, { requireAuth: false });
    return response;
  },

  // Search brands
  async searchBrands(query: string) {
    const response = await fetchApi(`/brands/search?q=${encodeURIComponent(query)}`, { requireAuth: false });
    return response;
  },

  // Lấy brand stats cho user
  async getBrandStats() {
    const response = await fetchApi(`/brands/stats`, { requireAuth: false });
    return response;
  },
}; 