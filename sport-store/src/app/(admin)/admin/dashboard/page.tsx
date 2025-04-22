'use client'

import { FileText, DollarSign, Users, Package } from 'lucide-react';
import { AnalyticsCard } from '@/components/admin/dashboard/analyticsCard';
import { RevenueChart } from '@/components/admin/dashboard/revenueChart';
import { BestSellingProducts } from '@/components/admin/dashboard/bestSellingProducts';
import { ActiveDeliveries } from '@/components/admin/dashboard/activeDeliveries';

interface ChartData {
  date: string;
  revenue: number;
}

export default function Dashboard() {
  // Data for the chart
  const chartData: ChartData[] = [
    { date: '01/01', revenue: 58000000 },
    { date: '02/01', revenue: 67000000 },
    { date: '03/01', revenue: 20000000 },
    { date: '04/01', revenue: 90100000 },
    { date: '05/01', revenue: 51000000 },
    { date: '06/01', revenue: 37000000 },
    { date: '07/01', revenue: 63000000 },
  ];
  
  // Best-selling products
  const bestSellingProducts = [
    { id: 1, name: 'Adidas Predator Freak FG', productCode: '#0987', sales: '1.3k', trend: 'up' as const },
    { id: 2, name: 'Nike Phantom GT Elite', productCode: '#0988', sales: '1.1k', trend: 'down' as const },
    { id: 3, name: 'Puma Future Z 1.1', productCode: '#0989', sales: '0.9k', trend: 'up' as const },
    { id: 4, name: 'New Balance Furon v6+', productCode: '#0990', sales: '0.8k', trend: 'up' as const },
  ];
  
  // Orders being delivered
  const activeDeliveries = [
    { id: '#01234', from: 'Lưu Hữu Phước', to: 'Phú Diễn', status: 'Đang giao', eta: '30 phút', progress: 70 },
    { id: '#01235', from: 'Nguyễn Thái Học', to: 'Cầu Giấy', status: 'Đang giao', eta: '45 phút', progress: 40 },
  ];

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
            <p className="text-gray-500 mt-2">Cập nhật mới nhất: 10/04/2025 - 08:45 AM</p>
          </div>
        </div>
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnalyticsCard 
            title="Tổng đơn hàng" 
            value="1.2K" 
            percentage={11.2} 
            isPositive={true}
            compareText="So với tháng trước"
            icon={<FileText className="text-indigo-600" size={22} />}
            gradient="from-indigo-50 to-white"
          />
          <AnalyticsCard 
            title="Tổng doanh thu" 
            value={formatCurrency(300215000)} 
            percentage={5.2} 
            isPositive={true} 
            compareText="So với tháng trước"
            icon={<DollarSign className="text-emerald-600" size={22} />}
            highlighted={true}
            gradient="from-emerald-50 to-white"
          />
          <AnalyticsCard 
            title="Tổng khách hàng" 
            value="1.2K" 
            percentage={11.2} 
            isPositive={true}
            compareText="So với tháng trước"
            icon={<Users className="text-amber-600" size={22} />}
            gradient="from-amber-50 to-white"
          />
          <AnalyticsCard 
            title="Tổng sản phẩm" 
            value="534" 
            percentage={-2.5} 
            isPositive={false}
            compareText="So với tháng trước"
            icon={<Package className="text-rose-600" size={22} />}
            gradient="from-rose-50 to-white"
          />
        </div>
        
        {/* Chart Section */}
        <RevenueChart chartData={chartData} formatCurrency={formatCurrency} />
        
        {/* Orders and Products Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BestSellingProducts products={bestSellingProducts} formatCurrency={formatCurrency} />
          <ActiveDeliveries deliveries={activeDeliveries} />
        </div>
      </div>
    </div>
  );
}