import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { CategoryListResponse, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';
import type { DashboardStats, RevenueData, BestSellingProduct, RecentOrder, BestSellingProductsResponse } from '@/types/dashboard';
import type { Order } from '@/types/order';
import type { CreateOrderData, OrderData, User } from '@/types/base';
import type { Product, ProductFormData, ProductQueryParams } from '@/types/product';
import type { AuthUser, RegisterRequest } from '@/types/auth';
import type { Coupon } from '@/types/coupon';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { fetchWithAuthNextJS } from '@/utils/fetchWithAuth';

// Types for API data
interface LoginCredentials {
  email: string;
  password: string;
}

interface MessageData {
  conversationId: string;
  content: string;
  type: string;
  [key: string]: unknown;
}

interface ApiParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  status?: string;
  [key: string]: string | number | undefined;
}

// API Client cho Next.js API routes (relative URLs)
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '', // Relative URLs - sẽ gọi Next.js API routes
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor để thêm token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor để xử lý lỗi
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  private handleError(error: unknown) {
    console.error('API Error:', error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        // Token hết hạn hoặc không hợp lệ
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          window.location.href = '/auth/login';
        }
      }
    }
  }

  setAuthToken(token: string | null) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  // Generic methods
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get(url, config);
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post(url, data, config);
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put(url, data, config);
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch(url, data, config);
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete(url, config);
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<AxiosResponse<{ success: boolean; message: string; data: { user: AuthUser; accessToken: string; refreshToken: string } }>> {
    return this.post('/api/auth/login', credentials);
  }

  async register(userData: RegisterRequest): Promise<AxiosResponse<{ success: boolean; message: string; data: { user: AuthUser; accessToken: string; refreshToken: string } }>> {
    return this.post('/api/auth/register', userData);
  }

  async logout(): Promise<AxiosResponse<{ success: boolean; message: string; data: Record<string, unknown> | null }>> {
    return this.post('/api/auth/logout');
  }

  async refreshToken() {
    return this.post('/api/auth/refresh-token');
  }

  async getProfile(): Promise<AxiosResponse<{ success: boolean; message: string; data: { user: AuthUser } }>> {
    return this.get('/api/auth/profile');
  }

  async updateProfile(data: { fullname?: string; phone?: string; address?: { street?: string; ward?: string; district?: string; province?: string }; avatar?: string }): Promise<AxiosResponse<{ success: boolean; message: string; data: { user: AuthUser } }>> {
    return this.put('/api/auth/profile', data);
  }

  // Cart methods
  async getCart(): Promise<AxiosResponse<{ success: boolean; message: string; data?: unknown }>> {
    return this.get('/api/cart');
  }

  async addToCart(productData: { sku: string; color?: string; size?: string; quantity?: number }): Promise<AxiosResponse<{ success: boolean; message: string; data?: unknown }>> {
    return this.post('/api/cart/add', productData);
  }

  async updateCart(productData: { sku: string; color?: string; size?: string; quantity?: number }): Promise<AxiosResponse<{ success: boolean; message: string; data?: unknown }>> {
    console.log('🔧 apiClient.updateCart called with PUT method:', productData);
    return this.put('/api/cart/update', productData);
  }

  async removeFromCart(productData: { sku: string; color?: string; size?: string }): Promise<any> {
    // Nếu là Next.js API route, dùng fetchWithAuthNextJS để luôn truyền token
    if (typeof window !== 'undefined' && (this.client.defaults.baseURL?.includes('/api') || this.client.defaults.baseURL === undefined)) {
      const res = await fetchWithAuthNextJS('/api/cart/remove', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      return { data };
    }
    // Nếu là backend API, dùng axios như cũ
    return this.post('/api/cart/remove', productData);
  }

  async clearCart() {
    return this.delete('/api/cart/clear');
  }

  // Order methods
  async getOrders(): Promise<AxiosResponse<{ success: boolean; message: string; data: Order[] }>> {
    return this.get('/api/orders');
  }

  async getOrderById(id: string): Promise<AxiosResponse<{ success: boolean; message: string; data: Order }>> {
    return this.get(`/api/orders/${id}`);
  }

  async getOrdersByPhone(phone: string): Promise<AxiosResponse<{ success: boolean; message: string; data: Order[] }>> {
    return this.get(`/api/orders/by-phone?phone=${phone}`);
  }

  async createOrder(orderData: CreateOrderData): Promise<AxiosResponse<{ success: boolean; message: string; data: Order }>> {
    return this.post('/api/orders', orderData);
  }

  async updateOrderStatus(id: string, status: string, data?: { reason?: string; note?: string }): Promise<AxiosResponse<{ success: boolean; message: string; data: Order }>> {
    return this.patch(`/api/orders/${id}/status`, { status, ...data });
  }

  // Product methods
  async getProducts(params?: ProductQueryParams): Promise<AxiosResponse<{ success: boolean; message: string; data: { products: Product[]; total: number; page: number; limit: number; totalPages: number } }>> {
    return this.get('/api/products', { params });
  }

  async getProductById(id: string): Promise<AxiosResponse<{ success: boolean; message: string; data: Product }>> {
    return this.get(`/api/products/${id}`);
  }

  async createProduct(productData: ProductFormData): Promise<AxiosResponse<{ success: boolean; message: string; data: Product }>> {
    return this.post('/api/products', productData);
  }

  async updateProduct(id: string, productData: ProductFormData): Promise<AxiosResponse<{ success: boolean; message: string; data: Product }>> {
    return this.put(`/api/products/${id}`, productData);
  }

  async deleteProduct(id: string): Promise<AxiosResponse<{ success: boolean; message: string; data: Product[] }>> {
    return this.delete(`/api/products/${id}`);
  }

  // Category methods
  async getCategories(): Promise<AxiosResponse<CategoryListResponse>> {
    return this.get('/api/categories');
  }

  async getCategoryById(id: string) {
    return this.get(`/api/categories/${id}`);
  }

  async createCategory(categoryData: CreateCategoryRequest): Promise<AxiosResponse<{ success: boolean; message: string; data?: unknown }>> {
    return this.post('/api/categories', categoryData);
  }

  async updateCategory(id: string, categoryData: UpdateCategoryRequest): Promise<AxiosResponse<{ success: boolean; message: string; data?: unknown }>> {
    return this.put(`/api/categories/${id}`, categoryData);
  }

  async deleteCategory(id: string): Promise<AxiosResponse<{ success: boolean; message: string; data?: unknown }>> {
    return this.delete(`/api/categories/${id}`);
  }

  // Upload methods
  async uploadFile(file: File): Promise<AxiosResponse<{ success: boolean; message: string; data: { url: string } }>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Dashboard methods
  async getDashboardStats(): Promise<import('axios').AxiosResponse<{ success: boolean; message: string; data: DashboardStats }>> {
    return this.get('/api/dashboard');
  }

  async getRecentOrders(): Promise<import('axios').AxiosResponse<{ success: boolean; message: string; data: RecentOrder[] }>> {
    return this.get('/api/dashboard/recent-orders');
  }

  async getBestSellingProducts(): Promise<import('axios').AxiosResponse<{ success: boolean; message: string; data: BestSellingProductsResponse }>> {
    return this.get('/api/dashboard/best-selling');
  }

  async getProductStats(): Promise<import('axios').AxiosResponse<{ success: boolean; message: string; data: unknown }>> {
    return this.get('/api/dashboard/product-stats');
  }

  async getRevenueStats(params?: Record<string, unknown>): Promise<import('axios').AxiosResponse<{ success: boolean; message: string; data: RevenueData[] }>> {
    return this.get('/api/dashboard/revenue', params ? { params } : undefined);
  }

  // Chat methods
  async getConversations() {
    return this.get('/api/chat/conversations');
  }

  async getMessages(conversationId: string) {
    return this.get(`/api/chat/messages/${conversationId}`);
  }

  async sendMessage(messageData: MessageData) {
    return this.post('/api/chat/send', messageData);
  }

  async markAsRead(conversationId: string) {
    return this.post(`/api/chat/mark-read/${conversationId}`);
  }

  // User methods
  async getUsers() {
    return this.get('/api/users');
  }

  // Coupon methods
  async getCoupons(search?: string, status?: string): Promise<AxiosResponse<{ success: boolean; message: string; data: { coupons: Coupon[]; pagination: { total: number; page: number; limit: number; totalPages: number } } }>> {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (status) params.status = status;
    return this.get('/api/coupons', { params });
  }

  async createCoupon(couponData: Record<string, unknown>) {
    return this.post('/api/coupons', couponData);
  }

  async updateCoupon(id: string, couponData: Record<string, unknown>) {
    return this.put(`/api/coupons/${id}`, couponData);
  }

  async deleteCoupon(id: string) {
    return this.delete(`/api/coupons/${id}`);
  }

  // Favorites methods
  async addToFavorites(productId: string) {
    return this.post('/api/favorites/add', { productId });
  }

  async removeFromFavorites(productId: string) {
    return this.post('/api/favorites/remove', { productId });
  }

  async getFavorites() {
    return this.get('/api/favorites');
  }

  async forgotPassword(email: string): Promise<AxiosResponse<{ success: boolean; message: string; data: Record<string, unknown> | null }>> {
    return this.post('/api/auth/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<AxiosResponse<{ success: boolean; message: string; data: Record<string, unknown> | null }>> {
    return this.post('/api/auth/reset-password', { token, newPassword });
  }

  async verifyOTP(data: { email: string; otp: string }): Promise<AxiosResponse<{ success: boolean; message: string; data: Record<string, unknown> | null }>> {
    return this.post('/api/auth/verify-otp', data);
  }

  async resendOTP(data: { email: string }): Promise<AxiosResponse<{ success: boolean; message: string; data: Record<string, unknown> | null }>> {
    return this.post('/api/auth/resend-otp', data);
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<AxiosResponse<{ success: boolean; message: string; data: Record<string, unknown> | null }>> {
    return this.post('/api/auth/change-password', data);
  }

  async googleAuth(): Promise<AxiosResponse<{ success: boolean; message: string; data: { url: string } }>> {
    return this.get('/api/auth/google');
  }

  async googleCallback(code: string): Promise<AxiosResponse<{ success: boolean; message: string; data: { user: AuthUser; accessToken: string; refreshToken: string } }>> {
    return this.get(`/api/auth/google/callback?code=${code}`);
  }

  async verifyAccount(data: { email: string; otp: string }): Promise<AxiosResponse<{ success: boolean; message: string; data: Record<string, unknown> | null }>> {
    return this.post('/api/auth/verify-account', data);
  }

  async requestUpdate(): Promise<AxiosResponse<{ success: boolean; message: string; data: Record<string, unknown> | null }>> {
    return this.post('/api/auth/request-update');
  }

  async updateUser(data: { fullname?: string; phone?: string; address?: { street?: string; ward?: string; district?: string; province?: string }; avatar?: string }): Promise<AxiosResponse<{ success: boolean; message: string; data: { user: AuthUser } }>> {
    return this.put('/api/auth/user', data);
  }

  async verifyToken(): Promise<AxiosResponse<{ success: boolean; message: string; data: { user: AuthUser } }>> {
    return this.get('/api/auth/verify-token');
  }

  async checkAuth(): Promise<AxiosResponse<{ success: boolean; message: string; data: { success: boolean; message: string; user?: AuthUser } }>> {
    return this.get('/api/auth/check');
  }

  async loginWithGoogle(token: string): Promise<AxiosResponse<{ success: boolean; message: string; data: { user: AuthUser; accessToken: string; refreshToken: string } }>> {
    return this.post('/api/auth/google/login', { token });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export the internal Axios instance for interceptors
export const axiosInstance = apiClient['client'];

export default apiClient; 