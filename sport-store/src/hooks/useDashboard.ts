import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/authContext';
import { apiClient } from '@/lib/apiClient';
import { ERROR_MESSAGES } from '@/config/constants';
import type { RevenueData, BestSellingProduct, RecentOrder, DashboardStats } from '@/types/dashboard';

type TimeRange = 'day' | 'month' | 'year';

interface DashboardData {
  stats: DashboardStats;
  revenue: RevenueData[];
  bestSellingProducts: BestSellingProduct[];
  recentOrders: RecentOrder[];
}

export const useDashboard = (timeRange: TimeRange = 'month') => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!isAuthenticated) {
        setError('User not authenticated');
        return;
      }

      // Gọi các API riêng lẻ và kết hợp dữ liệu
      const [statsRes, revenueRes, bestSellingRes, recentOrdersRes] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getRevenueStats({ period: timeRange }),
        apiClient.getBestSellingProducts(),
        apiClient.getRecentOrders(),
      ]);

      // Kiểm tra response
      if (!statsRes.data.success || !revenueRes.data.success || !bestSellingRes.data.success || !recentOrdersRes.data.success) {
        throw new Error('Failed to fetch dashboard data');
      }

      // Trích xuất dữ liệu từ response
      const stats = statsRes.data.data;
      const revenue = revenueRes.data.data || [];
      const bestSelling = bestSellingRes.data.data || [];
      const recentOrders = recentOrdersRes.data.data || [];

      // Xử lý dữ liệu doanh thu theo khoảng thời gian
      const processedRevenue = processRevenueData(revenue, timeRange);

      setDashboardData({
        stats,
        revenue: processedRevenue,
        bestSellingProducts: bestSelling,
        recentOrders,
      });
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      setError(error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, isAuthenticated]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const processRevenueData = (data: RevenueData[], period: TimeRange) => {
    if (!data || !Array.isArray(data)) return [];

    // Nếu có dữ liệu từ API, sử dụng trực tiếp
    if (data.length > 0) {
      return data;
    }

    let filteredData: RevenueData[] = [];

    switch (period) {
      case 'day':
        // Lấy 7 ngày gần nhất
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        // Tạo dữ liệu cho 7 ngày, ngày nào không có dữ liệu thì set revenue = 0
        filteredData = last7Days.map(date => {
          const [year, month, day] = date.split('-');
          const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
          const existingData = data.find(item => item.date === formattedDate);
          return {
            date: formattedDate,
            revenue: existingData ? existingData.revenue : 0,
            orderCount: existingData ? existingData.orderCount : 0
          };
        });
        break;

      case 'month':
        // Lấy 12 tháng gần nhất
        const last12Months = Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return date.toISOString().slice(0, 7); // Format: YYYY-MM
        }).reverse();

        filteredData = last12Months.map(date => {
          const [year, month] = date.split('-');
          const formattedDate = `${month.padStart(2, '0')}/${year}`;
          const existingData = data.find(item => item.date === formattedDate);
          return {
            date: formattedDate,
            revenue: existingData ? existingData.revenue : 0,
            orderCount: existingData ? existingData.orderCount : 0
          };
        });
        break;

      case 'year':
        // Lấy 5 năm gần nhất
        const last5Years = Array.from({ length: 5 }, (_, i) => {
          const date = new Date();
          date.setFullYear(date.getFullYear() - i);
          return date.getFullYear().toString();
        }).reverse();

        filteredData = last5Years.map(year => {
          const existingData = data.find(item => item.date === year);
          return {
            date: year,
            revenue: existingData ? existingData.revenue : 0,
            orderCount: existingData ? existingData.orderCount : 0
          };
        });
        break;
    }

    return filteredData;
  };

  return {
    dashboardData,
    isLoading,
    error,
    refetch: fetchDashboardData,
  };
}; 