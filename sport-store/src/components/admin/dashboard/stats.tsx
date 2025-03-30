import { useState, useEffect } from 'react';
import { getStats } from '@/lib/api';
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";

interface StatsData {
  totalOrders: number;
  totalDeliveringOrders: number;
  todayRevenue: number;
  revenueGrowth: number;
  newCustomers: number;
  customerGrowth: number;
}

interface ApiResponse {
  success: boolean;
  data: StatsData;
}

export default function Stats() {
  const [stats, setStats] = useState<StatsData>({
    totalOrders: 0,
    totalDeliveringOrders: 0,
    todayRevenue: 0,
    revenueGrowth: 0,
    newCustomers: 0,
    customerGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats() as ApiResponse;
        if (data?.success) {
          setStats(data.data);
        } else {
          console.warn('Không có dữ liệu thống kê');
        }
      } catch (error) {
        console.error('Lỗi khi lấy thống kê:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statistics = [
    { 
      title: "Tổng đơn hàng", 
      value: stats.totalOrders.toLocaleString(), 
      percent: "100%", 
      up: true, 
      icon: "🛒", 
      color: "#4F46E5" 
    },
    { 
      title: "Đơn đang giao", 
      value: stats.totalDeliveringOrders.toLocaleString(), 
      percent: `${((stats.totalDeliveringOrders / stats.totalOrders) * 100).toFixed(1)}%`, 
      up: stats.totalDeliveringOrders > 0, 
      icon: "🚚", 
      color: "#FACC15" 
    },
    { 
      title: "Doanh thu hôm nay", 
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.todayRevenue), 
      percent: `${stats.revenueGrowth}%`, 
      up: stats.revenueGrowth >= 0, 
      icon: "💰", 
      color: "#22C55E" 
    },
    { 
      title: "Khách hàng mới", 
      value: stats.newCustomers.toLocaleString(), 
      percent: `${stats.customerGrowth}%`, 
      up: stats.customerGrowth >= 0, 
      icon: "👥", 
      color: "#3B82F6" 
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statistics.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">{stat.icon}</span>
            <div className="flex items-center">
              {stat.up ? (
                <AiOutlineRise className="text-green-500" />
              ) : (
                <AiOutlineFall className="text-red-500" />
              )}
              <span className="text-sm text-gray-500 ml-1">{stat.percent}</span>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm mb-2">{stat.title}</h3>
          <p className="text-2xl font-bold" style={{ color: stat.color }}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
} 