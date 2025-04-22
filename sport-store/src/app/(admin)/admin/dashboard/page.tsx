'use client'

import { FileText, DollarSign, Users, Package } from 'lucide-react';
import { AnalyticsCard } from '@/components/admin/dashboard/analyticsCard';
import { RevenueChart } from '@/components/admin/dashboard/revenueChart';
import BestSellingProducts from '@/components/admin/dashboard/bestSellingProducts';
import { ActiveDeliveries } from '@/components/admin/dashboard/activeDeliveries';
import { useDashboard } from '@/hooks/useDashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { dashboardData, isLoading, error } = useDashboard();

  // Format currency function
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

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
          {isLoading ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              <AnalyticsCard 
                title="Tổng đơn hàng" 
                value={dashboardData?.stats?.totalOrders.toLocaleString() || '0'} 
                percentage={11.2} 
                isPositive={true}
                compareText="So với tháng trước"
                icon={<FileText className="text-indigo-600" size={22} />}
                gradient="from-indigo-50 to-white"
              />
              <AnalyticsCard 
                title="Tổng doanh thu" 
                value={formatCurrency(dashboardData?.stats?.totalRevenue || 0)} 
                percentage={5.2} 
                isPositive={true} 
                compareText="So với tháng trước"
                icon={<DollarSign className="text-emerald-600" size={22} />}
                highlighted={true}
                gradient="from-emerald-50 to-white"
              />
              <AnalyticsCard 
                title="Tổng khách hàng" 
                value={dashboardData?.stats?.totalCustomers.toLocaleString() || '0'} 
                percentage={11.2} 
                isPositive={true}
                compareText="So với tháng trước"
                icon={<Users className="text-amber-600" size={22} />}
                gradient="from-amber-50 to-white"
              />
              <AnalyticsCard 
                title="Tổng sản phẩm" 
                value={dashboardData?.stats?.totalProducts.toLocaleString() || '0'} 
                percentage={-2.5} 
                isPositive={false}
                compareText="So với tháng trước"
                icon={<Package className="text-rose-600" size={22} />}
                gradient="from-rose-50 to-white"
              />
            </>
          )}
        </div>
        
        {/* Chart Section */}
        {isLoading ? (
          <Skeleton className="h-96 mb-8" />
        ) : (
          <RevenueChart chartData={dashboardData?.revenue} formatCurrency={formatCurrency} />
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
              <ActiveDeliveries deliveries={dashboardData?.recentOrders} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}