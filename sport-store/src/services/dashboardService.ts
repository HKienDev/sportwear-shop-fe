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

export const getBestSellingProducts = async (): Promise<BestSellingProduct[]> => {
    try {
        const response = await dashboardApi.get('/best-selling-products');
        return response.data;
    } catch (error) {
        console.error('Error fetching best selling products:', error);
        throw error;
    }
};

export const getRecentOrders = async (): Promise<RecentOrder[]> => {
    try {
        const response = await dashboardApi.get('/recent-orders');
        return response.data;
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        throw error;
    }
};

export const getRevenue = async (): Promise<RevenueData[]> => {
    try {
        const response = await dashboardApi.get('/revenue');
        return response.data;
    } catch (error) {
        console.error('Error fetching revenue data:', error);
        throw error;
    }
};

export const getStats = async (): Promise<DashboardStats> => {
    try {
        const response = await dashboardApi.get('/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
}; 