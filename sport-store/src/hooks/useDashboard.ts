import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/authContext';
import { apiClient } from '@/lib/apiClient';
import { ERROR_MESSAGES } from '@/config/constants';
import type { DashboardData, RecentOrdersResponse, RecentOrder } from '@/types/dashboard';
import { processRevenueData, createFallbackStats } from '@/utils/dashboardUtils';

type TimeRange = 'day' | 'month' | 'year';

export const useDashboard = (timeRange: TimeRange = 'month') => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!isAuthenticated) {
        setError('User not authenticated');
        return;
      }

      console.log('🔄 Fetching dashboard data for timeRange:', timeRange);

      // Gọi các API riêng lẻ và kết hợp dữ liệu
      const [statsRes, revenueRes, bestSellingRes, recentOrdersRes] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getRevenueStats({ period: timeRange }),
        apiClient.getBestSellingProducts(),
        apiClient.getRecentOrders(),
      ]);

      console.log('✅ Dashboard API responses:', {
        stats: statsRes.data.success,
        revenue: revenueRes.data.success,
        bestSelling: bestSellingRes.data.success,
        recentOrders: recentOrdersRes.data.success
      });

      console.log('🔍 Best selling response structure:', {
        success: bestSellingRes.data.success,
        data: bestSellingRes.data.data,
        dataType: typeof bestSellingRes.data.data,
        hasProducts: bestSellingRes.data.data?.products,
        productsType: typeof bestSellingRes.data.data?.products,
        productsLength: bestSellingRes.data.data?.products?.length
      });

      // Kiểm tra response
      if (!statsRes.data.success || !revenueRes.data.success || !bestSellingRes.data.success || !recentOrdersRes.data.success) {
        throw new Error('Failed to fetch dashboard data');
      }

      // Trích xuất dữ liệu từ response với fallback
      const stats = statsRes.data.data || createFallbackStats();
      const revenue = revenueRes.data.data || [];
      const bestSelling = bestSellingRes.data.data?.products || [];
      
      // Xử lý recentOrders - có thể là array hoặc object
      let recentOrdersData: RecentOrdersResponse = { orders: [] };
      
      if (recentOrdersRes.data.data) {
        if (Array.isArray(recentOrdersRes.data.data)) {
          // Nếu là array, chuyển thành object với orders
          recentOrdersData = {
            orders: recentOrdersRes.data.data,
            pagination: undefined
          };
        } else if (typeof recentOrdersRes.data.data === 'object') {
          // Nếu là object, ép kiểu rõ ràng
          const dataObj = recentOrdersRes.data.data as { orders?: RecentOrder[]; pagination?: { totalPages: number; totalOrders: number; hasMore: boolean } };
          recentOrdersData = {
            orders: dataObj.orders || [],
            pagination: dataObj.pagination
          };
        }
      }

      // Xử lý dữ liệu doanh thu theo khoảng thời gian
      const processedRevenue = processRevenueData(revenue, timeRange);

      const newDashboardData: DashboardData = {
        stats,
        revenue: processedRevenue,
        bestSellingProducts: bestSelling,
        recentOrders: recentOrdersData,
      };

      console.log('📊 Processed dashboard data:', {
        statsKeys: Object.keys(newDashboardData.stats),
        revenueLength: newDashboardData.revenue.length,
        bestSellingLength: newDashboardData.bestSellingProducts.length,
        recentOrdersLength: newDashboardData.recentOrders.orders.length
      });

      setDashboardData(newDashboardData);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('❌ Dashboard data fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR;
      setError(errorMessage);
      
      // Auto retry logic
      if (retryCount < 3) {
        console.log(`🔄 Retrying dashboard fetch (${retryCount + 1}/3)...`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000 * (retryCount + 1)); // Exponential backoff
      }
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, isAuthenticated, retryCount]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    dashboardData,
    isLoading,
    error,
    refetch: fetchDashboardData,
  };
}; 