import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { TOKEN_CONFIG } from '@/config/token';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
}

interface RevenueData {
  month: string;
  revenue: number;
}

interface BestSellingProduct {
  _id: string;
  name: string;
  category: string;
  totalSales: number;
  image: string;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export const useDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
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

        console.log('Access Token:', accessToken);
        console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

        // Gọi các API riêng lẻ và kết hợp dữ liệu
        const [statsRes, revenueRes, bestSellingRes, recentOrdersRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/revenue`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/best-selling-products`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/recent-orders`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }),
        ]);

        // Log response status
        console.log('Stats Response Status:', statsRes.status);
        console.log('Revenue Response Status:', revenueRes.status);
        console.log('Best Selling Response Status:', bestSellingRes.status);
        console.log('Recent Orders Response Status:', recentOrdersRes.status);

        // Kiểm tra response
        if (!statsRes.ok || !revenueRes.ok || !bestSellingRes.ok || !recentOrdersRes.ok) {
          // Log error details
          if (!statsRes.ok) {
            const errorText = await statsRes.text();
            console.error('Stats Error:', errorText);
          }
          if (!revenueRes.ok) {
            const errorText = await revenueRes.text();
            console.error('Revenue Error:', errorText);
          }
          if (!bestSellingRes.ok) {
            const errorText = await bestSellingRes.text();
            console.error('Best Selling Error:', errorText);
          }
          if (!recentOrdersRes.ok) {
            const errorText = await recentOrdersRes.text();
            console.error('Recent Orders Error:', errorText);
          }
          
          throw new Error('Failed to fetch dashboard data');
        }

        // Parse JSON
        const [statsData, revenueData, bestSellingData, recentOrdersData] = await Promise.all([
          statsRes.json(),
          revenueRes.json(),
          bestSellingRes.json(),
          recentOrdersRes.json(),
        ]);

        console.log('Stats Data:', statsData);
        console.log('Revenue Data:', revenueData);
        console.log('Best Selling Data:', bestSellingData);
        console.log('Recent Orders Data:', recentOrdersData);

        // Kết hợp dữ liệu
        setDashboardData({
          stats: statsData.data,
          revenue: revenueData.data,
          bestSelling: bestSellingData.data,
          recentOrders: recentOrdersData.data,
        });
      } catch (err) {
        console.error('Dashboard Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  return {
    dashboardData,
    isLoading,
    error,
  };
}; 