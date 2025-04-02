import { API_URL } from '@/config/constants';
import axios from 'axios';
import type { 
    BestSellingProduct,
    RecentOrder,
    RevenueData,
    DashboardStats
} from '@/types/dashboard';

const dashboardApi = axios.create({
    baseURL: `${API_URL}/dashboard`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for debugging
dashboardApi.interceptors.request.use(
    (config) => {
        console.log('Dashboard Request config:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('Dashboard Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
dashboardApi.interceptors.response.use(
    (response) => {
        console.log('Dashboard Response:', {
            status: response.status,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    (error) => {
        console.error('Dashboard Response error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export interface RecentOrdersResponse {
    orders: RecentOrder[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalOrders: number;
        hasMore: boolean;
    };
}

export const getRecentOrders = async (page: number = 1, limit: number = 5): Promise<RecentOrdersResponse> => {
    try {
        const response = await dashboardApi.get('/recent-orders', {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        throw error;
    }
};

export interface RevenueResponse {
    data: RevenueData[];
    lastUpdated: string;
    months: number;
}

export interface BestSellingProductsResponse {
    products: BestSellingProduct[];
    lastUpdated: string;
    limit: number;
    days: number;
}

export interface DashboardStatsResponse {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
    lastUpdated: string;
}

export const getStats = async (): Promise<DashboardStatsResponse> => {
    try {
        const response = await dashboardApi.get('/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};

export const getRevenue = async (months: number = 6): Promise<RevenueResponse> => {
    try {
        const response = await dashboardApi.get('/revenue', {
            params: { months }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching revenue data:', error);
        throw error;
    }
};

export const getBestSellingProducts = async (limit: number = 5, days: number = 30): Promise<BestSellingProductsResponse> => {
    try {
        const response = await dashboardApi.get('/best-selling-products', {
            params: { limit, days }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching best selling products:', error);
        throw error;
    }
}; 