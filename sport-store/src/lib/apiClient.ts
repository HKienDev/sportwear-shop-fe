import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { CategoryListResponse, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';
import type { DashboardStats, RevenueData, RecentOrder, BestSellingProductsResponse } from '@/types/dashboard';
import type { Order } from '@/types/order';
import type { CreateOrderData } from '@/types/base';
import type { Product, ProductFormData, ProductQueryParams } from '@/types/product';
import type { AuthUser, RegisterRequest } from '@/types/auth';
import type { Coupon } from '@/types/coupon';
import { fetchWithAuthNextJS } from '@/utils/fetchWithAuth';
import { TOKEN_CONFIG } from '@/config/token';
import { handleAuthRedirect, shouldRedirectToLogin } from '@/utils/authRedirect';

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



// Optimized API Client for Next.js API routes using fetch instead of axios
class ApiClient {
  private client!: AxiosInstance;
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
    
    // Only create axios instance for server-side or when needed
    if (this.isClient) {
      this.client = axios.create({
        baseURL: 'http://localhost:4000/api', // Backend API URL
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
  }

  private getToken(): string | null {
    if (this.isClient) {
      return localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
    }
    return null;
  }

  private handleError(error: unknown) {
    console.error('API Error:', error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        // Token hết hạn hoặc không hợp lệ
        if (this.isClient) {
          localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
          
          // Sử dụng logic thông minh thay vì redirect trực tiếp
          const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
          if (shouldRedirectToLogin(currentPath)) {
            window.location.href = '/auth/login';
          } else {
            // Mở modal cho khách vãng lai
            handleAuthRedirect();
          }
        }
      }
    }
  }

  setAuthToken(token: string | null) {
    if (token && this.isClient) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else if (this.isClient) {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  // Optimized fetch-based methods for Next.js API routes
  private async fetchApi<T = unknown>(
    url: string, 
    options: RequestInit = {}
  ): Promise<{ data: T; status: number }> {
    const token = this.getToken();
    let headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (options.headers) {
      if (Array.isArray(options.headers)) {
        headers = Object.fromEntries(options.headers as [string, string][]);
      } else if (options.headers instanceof Headers) {
        headers = Object.fromEntries((options.headers as Headers).entries());
      } else {
        headers = { ...options.headers } as Record<string, string>;
      }
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(url, {
      ...options,
      headers,
    });
    if (!response.ok) {
      if (response.status === 401 && this.isClient) {
        localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
        
        // Tạo custom error với message thân thiện
        const error = new Error('Vui lòng đăng nhập để thực hiện hành động này');
        (error as any).status = 401;
        (error as any).isAuthError = true;
        throw error;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data, status: response.status };
  }

  // Generic methods using fetch for Next.js API routes
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (this.isClient && url.startsWith('/api/')) {
      // Xử lý query parameters cho client-side
      let fullUrl = url;
      if (config?.params) {
        const searchParams = new URLSearchParams();
        Object.entries(config.params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        const queryString = searchParams.toString();
        if (queryString) {
          fullUrl = `${url}?${queryString}`;
        }
      }
      const { data, status } = await this.fetchApi<T>(fullUrl);
      return { data, status } as AxiosResponse<T>;
    }
    if (!this.client) {
      throw new Error('Axios client not initialized');
    }
    return this.client.get(url, config);
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (this.isClient && url.startsWith('/api/')) {
      const { data: responseData, status } = await this.fetchApi<T>(url, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return { data: responseData, status } as AxiosResponse<T>;
    }
    if (!this.client) {
      throw new Error('Axios client not initialized');
    }
    return this.client.post(url, data, config);
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (this.isClient && url.startsWith('/api/')) {
      const { data: responseData, status } = await this.fetchApi<T>(url, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return { data: responseData, status } as AxiosResponse<T>;
    }
    if (!this.client) {
      throw new Error('Axios client not initialized');
    }
    return this.client.put(url, data, config);
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (this.isClient && url.startsWith('/api/')) {
      const { data: responseData, status } = await this.fetchApi<T>(url, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return { data: responseData, status } as AxiosResponse<T>;
    }
    if (!this.client) {
      throw new Error('Axios client not initialized');
    }
    return this.client.patch(url, data, config);
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (this.isClient && url.startsWith('/api/')) {
      const { data: responseData, status } = await this.fetchApi<T>(url, {
        method: 'DELETE',
      });
      return { data: responseData, status } as AxiosResponse<T>;
    }
    if (!this.client) {
      throw new Error('Axios client not initialized');
    }
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

  async removeFromCart(productData: { sku: string; color?: string; size?: string }): Promise<AxiosResponse<{ success: boolean; message: string; data?: unknown }>> {
    // Nếu là Next.js API route, dùng fetchWithAuthNextJS để luôn truyền token
    if (typeof window !== 'undefined' && (this.client.defaults.baseURL?.includes('/api') || this.client.defaults.baseURL === undefined)) {
      const res = await fetchWithAuthNextJS('/api/cart/remove', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      return { data, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse<{ success: boolean; message: string; data?: unknown }>;
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
    // Gọi trực tiếp đến backend, không qua Next.js API route
    if (!this.client) {
      throw new Error('Axios client not initialized');
    }
    return this.client.get(`/orders/phone/${phone}`);
  }

  async createOrder(orderData: CreateOrderData): Promise<AxiosResponse<{ success: boolean; message: string; data: Order }>> {
    return this.post('/api/orders', orderData);
  }

  async updateOrderStatus(id: string, status: string, data?: { reason?: string; note?: string }): Promise<AxiosResponse<{ success: boolean; message: string; data: Order }>> {
    return this.patch(`/api/orders/${id}/status`, { status, ...data });
  }

  // Product methods
  async getProducts(params?: ProductQueryParams): Promise<AxiosResponse<{ success: boolean; message: string; data: { products: Product[]; total: number; page: number; limit: number; totalPages: number } }>> {
    // Kiểm tra nếu có params và có thể là admin request
    const isAdminRequest = params && typeof params === 'object' && 'limit' in params && (params as any).limit >= 1000;
    const endpoint = isAdminRequest ? '/api/products/admin' : '/api/products';
    
    // Nếu là admin request, gọi Next.js API route
    if (isAdminRequest && typeof window !== 'undefined') {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }
      
      const res = await fetchWithAuthNextJS(`${endpoint}?${queryParams.toString()}`);
      const data = await res.json();
      return { data, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse<{ success: boolean; message: string; data: { products: Product[]; total: number; page: number; limit: number; totalPages: number } }>;
    }
    
    // Nếu không phải admin request, gọi backend trực tiếp
    return this.get(endpoint, { params });
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
    return this.get('/api/dashboard/revenue', { params });
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
    return this.get('/api/admin/users');
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