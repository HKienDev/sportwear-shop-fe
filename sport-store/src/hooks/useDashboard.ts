import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/authContext';
import { TOKEN_CONFIG } from '@/config/token';
import { API_URL, ENDPOINTS } from '@/config/api';

interface RevenueData {
  date: string;
  revenue: number;
  orderCount: number;
}

type TimeRange = 'day' | 'month' | 'year';

interface DashboardData {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
    growth: {
      orders: number;
      revenue: number;
      customers: number;
      products: number;
    };
  };
  revenue: RevenueData[];
  bestSellingProducts: Array<{
    _id: string;
    name: string;
    category: string;
    totalSales: number;
    image: string;
    sku: string;
    growthRate: number;
  }>;
  recentOrders: {
    orders: Array<{
      _id: string;
      orderNumber: string;
      customerName: string;
      customerEmail: string;
      total: number;
      status: string;
      progress: number;
      createdAt: string;
      originAddress: string;
      destinationAddress: string;
      statusHistory: Array<{
        status: string;
        updatedAt: string;
        updatedBy: string;
        note: string;
        _id: string;
      }>;
    }>;
  };
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

      // Lấy token từ localStorage
      const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      
      if (!accessToken) {
        setError('No access token found');
        return;
      }

      // Gọi các API riêng lẻ và kết hợp dữ liệu
      const [statsRes, revenueRes, bestSellingRes, recentOrdersRes] = await Promise.all([
        fetch(`${API_URL}${ENDPOINTS.DASHBOARD.STATS}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }),
        fetch(`${API_URL}${ENDPOINTS.DASHBOARD.REVENUE}?period=${timeRange}&limit=${timeRange === 'day' ? 7 : timeRange === 'month' ? 12 : 5}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }),
        fetch(`${API_URL}${ENDPOINTS.DASHBOARD.BEST_SELLING}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }),
        fetch(`${API_URL}${ENDPOINTS.DASHBOARD.RECENT_ORDERS}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }),
      ]);

      // Kiểm tra response
      if (!statsRes.ok || !revenueRes.ok || !bestSellingRes.ok || !recentOrdersRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      // Parse response data
      const [statsData, revenueData, bestSellingData, recentOrdersData] = await Promise.all([
        statsRes.json(),
        revenueRes.json(),
        bestSellingRes.json(),
        recentOrdersRes.json(),
      ]);

      // Kiểm tra và trích xuất dữ liệu từ response
      const stats = statsData.success ? statsData.data : {
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        totalProducts: 0,
        growth: {
          orders: 0,
          revenue: 0,
          customers: 0,
          products: 0
        }
      };

      const revenue = revenueData.success ? revenueData.data.revenue : [];
      const bestSelling = bestSellingData.success ? bestSellingData.data.products : [];
      const recentOrders = recentOrdersData.success ? recentOrdersData.data : { orders: [] };

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
      setError(error instanceof Error ? error.message : 'An error occurred');
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

        filteredData = last12Months.map(month => {
          const [year, monthNum] = month.split('-');
          const formattedDate = `${monthNum.padStart(2, '0')}/${year}`;
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
    refresh: fetchDashboardData
  };
}; 