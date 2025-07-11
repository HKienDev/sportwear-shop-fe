'use client'

import { FileText, DollarSign, Users, Package } from 'lucide-react';
import { AnalyticsCard } from '@/components/admin/dashboard/analyticsCard';
import { RevenueChart } from '@/components/admin/dashboard/revenueChart';
import BestSellingProducts from '@/components/admin/dashboard/bestSellingProducts';
import { ActiveDeliveries } from '@/components/admin/dashboard/activeDeliveries';
import { useDashboard } from '@/hooks/useDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';


type TimeRange = 'day' | 'month' | 'year';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const { dashboardData, isLoading, error, refetch } = useDashboard(timeRange);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/auth/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    // Lắng nghe sự kiện xóa đơn hàng
    const handleOrderDeleted = () => {
      refetch();
    };

    // Lắng nghe sự kiện xóa sản phẩm
    const handleProductDeleted = () => {
      refetch();
    };

    window.addEventListener('orderDeleted', handleOrderDeleted);
    window.addEventListener('productDeleted', handleProductDeleted);

    return () => {
      window.removeEventListener('orderDeleted', handleOrderDeleted);
      window.removeEventListener('productDeleted', handleProductDeleted);
    };
  }, [refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div>No data available</div>;
  }

  const { stats, revenue, recentOrders } = dashboardData;

  // Format currency function
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Tổng Quan Doanh Thu
            </h1>
            <p className="text-gray-500 mt-2">
              Cập nhật mới nhất: {new Date().toLocaleDateString('vi-VN')} - {new Date().toLocaleTimeString('vi-VN')}
            </p>
          </div>
        </div>
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnalyticsCard
            title="Tổng Đơn Hàng"
            value={stats.totalOrders}
            icon={<FileText className="h-6 w-6 text-blue-500" />}
            percentage={stats.growth.orders}
            trend={stats.growth.orders >= 0 ? 'up' : 'down'}
            compareText="So với tháng trước"
            loading={isLoading}
          />
          <AnalyticsCard
            title="Tổng Doanh Thu"
            value={formatCurrency(stats.totalRevenue)}
            icon={<DollarSign className="h-6 w-6 text-green-500" />}
            percentage={stats.growth.revenue}
            trend={stats.growth.revenue >= 0 ? 'up' : 'down'}
            compareText="So với tháng trước"
            loading={isLoading}
          />
          <AnalyticsCard
            title="Tổng Khách Hàng"
            value={stats.totalCustomers}
            icon={<Users className="h-6 w-6 text-purple-500" />}
            percentage={stats.growth.customers}
            trend={stats.growth.customers >= 0 ? 'up' : 'down'}
            compareText="So với tháng trước"
            loading={isLoading}
          />
          <AnalyticsCard
            title="Tổng Sản Phẩm"
            value={stats.totalProducts}
            icon={<Package className="h-6 w-6 text-orange-500" />}
            percentage={stats.growth.products}
            trend={stats.growth.products >= 0 ? 'up' : 'down'}
            compareText="So với tháng trước"
            loading={isLoading}
          />
        </div>
        
        {/* Chart Section */}
        {isLoading ? (
          <Skeleton className="h-96 mb-8" />
        ) : (
          <div className="mb-8">
            <RevenueChart 
              chartData={revenue} 
              formatCurrency={formatCurrency}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
          </div>
        )}
        
        {/* Orders and Products Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
            </>
          ) : (
            <>
              <BestSellingProducts />
              <ActiveDeliveries deliveries={recentOrders?.orders || []} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}