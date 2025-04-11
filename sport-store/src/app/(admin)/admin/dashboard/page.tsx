'use client'

import { useState } from 'react';
import Image from 'next/image';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, ArrowUp, ArrowDown, FileText, Filter, ChevronRight, ExternalLink, 
         PieChart, Clock, Users, Package, DollarSign} from 'lucide-react';

interface ChartData {
  date: string;
  revenue: number;
}

interface TooltipData {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
    value: number;
  }>;
}

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  percentage: number;
  isPositive: boolean;
  compareText: string;
  icon: React.ReactNode;
  highlighted?: boolean;
  gradient?: string;
}

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState('day');
  
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
    { id: 1, name: 'Adidas Predator Freak FG', productCode: '#0987', sales: '1.3k', trend: 'up' },
    { id: 2, name: 'Nike Phantom GT Elite', productCode: '#0988', sales: '1.1k', trend: 'down' },
    { id: 3, name: 'Puma Future Z 1.1', productCode: '#0989', sales: '0.9k', trend: 'up' },
    { id: 4, name: 'New Balance Furon v6+', productCode: '#0990', sales: '0.8k', trend: 'up' },
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

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: TooltipData) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
          <p className="font-medium text-gray-800">{payload[0].payload.date}</p>
          <p className="text-red-600 font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
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
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100 overflow-hidden relative hover:shadow-lg transition-shadow duration-300">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-600 to-indigo-400"></div>
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Tổng Doanh Thu</h2>
              <div className="flex items-center mt-1">
                <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                  {formatCurrency(300215000)}
                </p>
                <div className="flex items-center ml-4 px-2 py-1 bg-emerald-50 rounded-full text-emerald-600 text-sm">
                  <ArrowUp size={14} />
                  <span className="ml-1 font-medium">5.2%</span>
                </div>
              </div>
            </div>
            
            {/* Time Filters */}
            <div className="flex p-1 bg-gray-50 rounded-lg border border-gray-100">
              <button 
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  timeFilter === 'day' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`} 
                onClick={() => setTimeFilter('day')}
              >
                Ngày
              </button>
              <button 
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  timeFilter === 'month' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`} 
                onClick={() => setTimeFilter('month')}
              >
                Tháng
              </button>
              <button 
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  timeFilter === 'year' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`} 
                onClick={() => setTimeFilter('year')}
              >
                Năm
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-medium text-gray-500">Trung Bình Mỗi Ngày</h2>
              <p className="text-xl font-semibold text-black mt-1">{formatCurrency(58045000)}</p>
            </div>
            <div className="flex items-center text-sm font-medium text-gray-500">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
                <span>Doanh thu thực tế</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                <span>Dự kiến</span>
              </div>
            </div>
          </div>
          
          {/* Bar Chart */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => `${value / 1000000}M`}
                  width={60}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                <Bar 
                  dataKey="revenue" 
                  fill="#dc2626" 
                  radius={[6, 6, 0, 0]} 
                  barSize={38}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex justify-center">
            <button className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 transition-colors">
              Xem chi tiết báo cáo doanh thu
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
        
        {/* Orders and Products Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Orders */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center mr-3">
                    <Clock className="text-white" size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Đơn Đang Được Giao</h2>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-xs font-medium text-gray-500">Đang giao: 2/15</span>
                  <button className="flex items-center text-gray-700 hover:text-red-600 transition-colors">
                    <Filter size={16} className="mr-1" />
                    <span className="text-sm">Lọc</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {activeDeliveries.map((delivery, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-900 mr-2">{delivery.id}</span>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">{delivery.status}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">ETA: {delivery.eta}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center my-4">
                      <div className="flex flex-col items-center mr-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <div className="w-0.5 h-8 bg-gray-200 my-1"></div>
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-900">{delivery.from}</p>
                          <p className="text-xs text-gray-500">Điểm xuất phát</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{delivery.to}</p>
                          <p className="text-xs text-gray-500">Điểm đến</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-500">Tiến độ</span>
                        <span className="text-xs font-medium text-black">{delivery.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-600 rounded-full" 
                          style={{ width: `${delivery.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button className="text-red-600 text-sm font-medium flex items-center hover:text-red-800 transition-colors">
                        Chi tiết
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button className="text-white font-medium px-4 py-2 bg-black rounded-lg hover:bg-gray-800 transition-colors flex items-center mx-auto">
                  Xem tất cả đơn hàng
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Best Selling Products */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mr-3">
                    <PieChart className="text-red-600" size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Sản Phẩm Bán Chạy</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-gray-500">Tháng 04/2025</span>
                  <button className="text-sm text-red-600 font-medium hover:text-red-800 transition-colors">
                    Xem tất cả
                  </button>
                </div>
              </div>
              
              <div className="space-y-5">
                {bestSellingProducts.map((product, index) => (
                  <div key={index} className="flex justify-between items-center p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4 flex items-center justify-center">
                          <Image 
                            src="/api/placeholder/64/64" 
                            alt={product.name} 
                            width={64} 
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500 mr-3">Mã: {product.productCode}</span>
                          <div className={`flex items-center text-xs ${product.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                            {product.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                            <span className="ml-1">{product.trend === 'up' ? '+12%' : '-8%'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="px-3 py-1 bg-red-50 rounded-full text-red-600 text-sm font-medium">
                        {product.sales} lượt bán
                      </div>
                      <button className="text-gray-400 hover:text-red-600 transition-colors mt-2">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">Thống Kê Sản Phẩm</h3>
                    <p className="text-sm text-gray-500 mt-1">Tổng doanh số tuần này</p>
                  </div>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(152000000)}</p>
                </div>
                <div className="mt-4 flex justify-center">
                  <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                    Xem báo cáo chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard({ 
  title, 
  value, 
  percentage, 
  isPositive, 
  compareText, 
  icon, 
  highlighted = false, 
  gradient = "from-gray-50 to-white" 
}: AnalyticsCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md border border-gray-100 
                    ${highlighted ? 'border-l-4 border-l-emerald-600' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-gray-700 font-medium">{title}</h3>
        <div className={`w-10 h-10 rounded-lg bg-opacity-20 flex items-center justify-center ${
          highlighted ? 'bg-emerald-100' : 'bg-gray-100'
        }`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-2xl font-bold ${
          highlighted ? 'text-emerald-600' : 'text-gray-900'
        }`}>{value}</p>
        <div className="flex items-center mt-2">
          <div className={`flex items-center ${
            isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
          } px-2 py-1 rounded-full`}>
            {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span className="ml-1 text-sm font-medium">{Math.abs(percentage)}%</span>
          </div>
          <span className="text-xs text-gray-500 ml-2">{compareText}</span>
        </div>
      </div>
    </div>
  );
}