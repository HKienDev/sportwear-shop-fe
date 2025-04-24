/**
 * Cấu hình API
 */

// URL API từ biến môi trường
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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

// Cấu hình endpoints
export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  // Orders
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    BULK_DELETE: '/orders/bulk-delete',
  },
  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    REVENUE: '/dashboard/revenue',
    BEST_SELLING: '/dashboard/best-selling-products',
    RECENT_ORDERS: '/dashboard/recent-orders',
  },
}; 