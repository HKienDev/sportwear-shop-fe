import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/authContext';
import { apiClient } from '@/lib/apiClient';
import { ERROR_MESSAGES } from '@/config/constants';
import type { DashboardData, RecentOrdersResponse, RecentOrder } from '@/types/dashboard';
import { processRevenueData, createFallbackStats } from '@/utils/dashboardUtils';

type TimeRange = 'day' | 'month' | 'year';

export const useDashboard = (timeRange: TimeRange = 'day') => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef(false);
  const lastFetchRef = useRef<{ timeRange: TimeRange; timestamp: number } | null>(null);

  const fetchDashboardData = useCallback(async () => {
    // Prevent duplicate calls
    if (isFetchingRef.current) {
      console.log('🚫 Dashboard - Already fetching, skipping...');
      return;
    }

    // Check if we already fetched this timeRange recently (within 1 second)
    const now = Date.now();
    const lastFetch = lastFetchRef.current;
    if (lastFetch && 
        lastFetch.timeRange === timeRange && 
        now - lastFetch.timestamp < 1000) {
      console.log('🚫 Dashboard - Recently fetched same timeRange, skipping...');
      return;
    }

    try {
      console.log('🔄 Dashboard - Fetching data for timeRange:', timeRange);
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      if (!isAuthenticated) {
        setError('User not authenticated');
        return;
      }

      const revenueParams = { period: timeRange };

      // Gọi các API riêng lẻ và kết hợp dữ liệu
      const [statsRes, revenueRes, bestSellingRes, recentOrdersRes] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getRevenueStats(revenueParams),
        apiClient.getBestSellingProducts(),
        apiClient.getRecentOrders(),
      ]);

      const revenue = revenueRes.data.data || { revenue: [] };

      // Kiểm tra response
      if (!statsRes.data.success || !revenueRes.data.success || !bestSellingRes.data.success || !recentOrdersRes.data.success) {
        throw new Error('Failed to fetch dashboard data');
      }

      // Trích xuất dữ liệu từ response với fallback
      const stats = statsRes.data.data || createFallbackStats();
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
      const processedRevenue = processRevenueData((revenue as any).revenue || [], timeRange);

      const newDashboardData: DashboardData = {
        stats,
        revenue: processedRevenue,
        bestSellingProducts: bestSelling,
        recentOrders: recentOrdersData,
      };

      setDashboardData(newDashboardData);
      setRetryCount(0); // Reset retry count on success
      
      // Update last fetch info
      lastFetchRef.current = {
        timeRange,
        timestamp: Date.now()
      };
      
      console.log('✅ Dashboard - Data fetched successfully');
    } catch (error) {
      console.error('❌ Dashboard data fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR;
      setError(errorMessage);
      
      // Auto retry logic
      if (retryCount < 3) {
        // Clear existing timeout
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
        
        retryTimeoutRef.current = setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000 * (retryCount + 1)); // Exponential backoff
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [timeRange, isAuthenticated]);

  // Main data fetch effect - optimized to prevent spam
  useEffect(() => {
    if (isAuthenticated) {
      // Debounce the fetch to prevent rapid successive calls
      const timeoutId = setTimeout(() => {
        fetchDashboardData();
      }, 100); // 100ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [timeRange, isAuthenticated, fetchDashboardData]);

  // Retry effect - only when retryCount changes
  useEffect(() => {
    if (retryCount > 0 && isAuthenticated) {
      fetchDashboardData();
    }
  }, [retryCount, isAuthenticated]);

  // Cleanup timeout and refs on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      isFetchingRef.current = false;
      lastFetchRef.current = null;
    };
  }, []);

  const refetch = useCallback(() => {
    setRetryCount(0); // Reset retry count
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    dashboardData,
    isLoading,
    error,
    refetch,
  };
}; 