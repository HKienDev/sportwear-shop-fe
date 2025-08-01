/**
 * Cấu hình API
 */

// Cấu hình timeout cho các request
export const API_TIMEOUT = 30000; // 30 giây

// Cấu hình retry cho các request
export const API_RETRY = {
  maxRetries: 3,
  retryDelay: 1000, // 1 giây
};

// Cấu hình headers mặc định
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// API Configuration - Chỉ sử dụng Next.js API routes
export const API_CONFIG = {
  // Frontend API routes (Next.js) - Relative URLs
  FRONTEND_API: {
    // Auth
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh-token',
      PROFILE: '/api/auth/profile',
      VERIFY: '/api/auth/verify-token',
    },
    
    // Cart
    CART: {
      GET: '/api/cart',
      ADD: '/api/cart/add',
      UPDATE: '/api/cart/update',
      REMOVE: '/api/cart/remove',
      CLEAR: '/api/cart',
    },
    
    // Orders
    ORDERS: {
      GET_ALL: '/api/orders',
      GET_BY_ID: (id: string) => `/api/orders/${id}`,
      CREATE: '/api/orders',
      UPDATE: (id: string) => `/api/orders/${id}`,
      DELETE: (id: string) => `/api/orders/${id}`,
      UPDATE_STATUS: (id: string) => `/api/orders/${id}/status`,
      GET_BY_PHONE: '/api/orders/phone',
      GET_ADMIN: '/api/orders/admin',
    },
    
    // Products
    PRODUCTS: {
      GET_ALL: '/api/products',
      GET_BY_ID: (id: string) => `/api/products/${id}`,
      CREATE: '/api/products',
      UPDATE: (id: string) => `/api/products/${id}`,
      DELETE: (id: string) => `/api/products/${id}`,
      GET_ADMIN: '/api/products/admin',
      TOGGLE_STATUS: (id: string) => `/api/products/${id}/toggle-status`,
    },
    
    // Categories
    CATEGORIES: {
      GET_ALL: '/api/categories',
      GET_BY_ID: (id: string) => `/api/categories/${id}`,
      CREATE: '/api/categories',
      UPDATE: (id: string) => `/api/categories/${id}`,
      DELETE: (id: string) => `/api/categories/${id}`,
      GET_ADMIN: '/api/categories/admin',
      UPDATE_STATUS: (id: string) => `/api/categories/${id}/status`,
    },
    
    // Upload
    UPLOAD: {
      FILE: '/api/upload',
    },
    
    // Dashboard
    DASHBOARD: {
      STATS: '/api/dashboard',
      RECENT_ORDERS: '/api/dashboard/recent-orders',
      BEST_SELLING: '/api/dashboard/best-selling',
      PRODUCT_STATS: '/api/dashboard/product-stats',
      REVENUE: '/api/dashboard/revenue',
    },
    
    // Chat
    CHAT: {
      CONVERSATIONS: '/api/chat/conversations',
      MESSAGES: (conversationId: string) => `/api/chat/messages/${conversationId}`,
      SEND: '/api/chat/send',
      MARK_READ: (conversationId: string) => `/api/chat/mark-read/${conversationId}`,
    },
    
    // Users
    USERS: {
      GET_ALL: '/api/users',
      GET_BY_ID: (id: string) => `/api/users/${id}`,
      UPDATE: (id: string) => `/api/users/${id}`,
      DELETE: (id: string) => `/api/users/${id}`,
    },
    
    // Coupons
    COUPONS: {
      GET_ALL: '/api/coupons',
      GET_BY_ID: (id: string) => `/api/coupons/${id}`,
      CREATE: '/api/coupons',
      UPDATE: (id: string) => `/api/coupons/${id}`,
      DELETE: (id: string) => `/api/coupons/${id}`,
      GET_ADMIN: '/api/coupons/admin',
    },
    
    // Favorites
    FAVORITES: {
      GET_ALL: '/api/favorites',
      ADD: '/api/favorites/add',
      REMOVE: '/api/favorites/remove',
    },
    
    // Questions
    QUESTIONS: {
      GET_PRODUCT: (productSku: string) => `/api/questions/product/${productSku}`,
      CREATE: '/api/questions',
      DELETE: (id: string) => `/api/questions/${id}`,
      MARK_HELPFUL: (id: string) => `/api/questions/helpful/${id}`,
      GET_USER: '/api/questions/user',
      GET_ADMIN_PENDING: '/api/questions/admin/pending',
      APPROVE: (id: string) => `/api/questions/admin/${id}/approve`,
      REJECT: (id: string) => `/api/questions/admin/${id}/reject`,
      ANSWER: (id: string) => `/api/questions/admin/${id}/answer`,
      VERIFY: (id: string) => `/api/questions/admin/${id}/verify`,
    },
  },
  
  // Socket configuration
  SOCKET: {
    URL: process.env.NODE_ENV === 'production' 
      ? 'wss://your-production-domain.com' 
      : 'ws://localhost:4000',
  },
  
  // Environment configuration
  ENV: {
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
  }
};

// Helper function để tạo URL cho API calls
export const createApiUrl = (endpoint: string, params?: Record<string, string | number>): string => {
  let url = endpoint;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }
  
  return url;
};

// Export default config
export default API_CONFIG; 