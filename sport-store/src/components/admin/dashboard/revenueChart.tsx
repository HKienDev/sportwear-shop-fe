import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dispatch, SetStateAction, useState } from 'react';
import { TrendingUp, Calendar, DollarSign, BarChart3, ChevronDown } from 'lucide-react';

interface ChartData {
  date: string;
  revenue: number;
  orderCount: number;
}

interface TooltipData {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
    value: number;
  }>;
}

type TimeRange = 'day' | 'month' | 'year';

interface RevenueChartProps {
  chartData?: ChartData[] | null;
  formatCurrency: (value: number) => string;
  timeRange: TimeRange;
  onTimeRangeChange: Dispatch<SetStateAction<TimeRange>>;
  loading?: boolean;
}

export function RevenueChart({ 
  chartData, 
  formatCurrency, 
  timeRange, 
  onTimeRangeChange,
  loading = false 
}: RevenueChartProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Chuyển đổi dữ liệu thành mảng ChartData
  const convertToChartData = (data: RevenueChartProps['chartData']): ChartData[] => {
    if (!data) return [];
    
    if (Array.isArray(data)) {
      return data;
    }
    
    return [];
  };

  // Xử lý dữ liệu an toàn
  const safeChartData = convertToChartData(chartData);
  
  // Tạo dữ liệu mẫu khi không có dữ liệu
  const generateEmptyData = (): ChartData[] => {
    const now = new Date();
    const emptyData: ChartData[] = [];
    
    switch (timeRange) {
      case 'day':
        // 7 ngày gần nhất
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          emptyData.push({
            date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/'),
            revenue: 0,
            orderCount: 0
          });
        }
        break;
        
      case 'month':
        // 12 tháng gần nhất
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          emptyData.push({
            date: date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }),
            revenue: 0,
            orderCount: 0
          });
        }
        break;
        
      case 'year':
        // 5 năm gần nhất
        for (let i = 4; i >= 0; i--) {
          const year = now.getFullYear() - i;
          emptyData.push({
            date: year.toString(),
            revenue: 0,
            orderCount: 0
          });
        }
        break;
    }
    
    return emptyData;
  };
  
  // Sử dụng dữ liệu thực hoặc dữ liệu mẫu nếu không có dữ liệu
  const displayData = safeChartData.length > 0 ? safeChartData : generateEmptyData();
  
  // Tính tổng doanh thu và trung bình
  const totalRevenue = displayData.reduce((sum, item) => sum + (item?.revenue || 0), 0);
  const averageRevenue = displayData.length > 0 ? totalRevenue / displayData.length : 0;

  // Tính phần trăm tăng trưởng
  const calculateGrowth = () => {
    if (displayData.length < 2) return 0;
    const currentPeriod = displayData.slice(-1)[0]?.revenue || 0;
    const previousPeriod = displayData.slice(-2)[0]?.revenue || 0;
    if (previousPeriod === 0) return currentPeriod > 0 ? 100 : 0;
    return ((currentPeriod - previousPeriod) / previousPeriod) * 100;
  };

  const growthPercentage = calculateGrowth();

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: TooltipData) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-4 shadow-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{data.date}</p>
          <div className="space-y-1">
            <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
              {formatCurrency(data.revenue)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {data.orderCount} đơn hàng
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'day': return '7 ngày gần nhất';
      case 'month': return '12 tháng gần nhất';
      case 'year': return '5 năm gần nhất';
      default: return '';
    }
  };

  const getAverageLabel = () => {
    switch (timeRange) {
      case 'day': return 'Trung bình/ngày';
      case 'month': return 'Trung bình/tháng';
      case 'year': return 'Trung bình/năm';
      default: return '';
    }
  };

  const getTotalLabel = () => {
    switch (timeRange) {
      case 'day': return 'Tổng 7 ngày';
      case 'month': return 'Tổng 12 tháng';
      case 'year': return 'Tổng 5 năm';
      default: return '';
    }
  };

  const getCurrentTimeRangeText = () => {
    switch (timeRange) {
      case 'day': return '7 ngày';
      case 'month': return '12 tháng';
      case 'year': return '5 năm';
      default: return '';
    }
  };

  const timeRangeOptions = [
    { value: 'day', label: '7 ngày' },
    { value: 'month', label: '12 tháng' },
    { value: 'year', label: '5 năm' }
  ];

  return (
    <div className="relative group overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Biểu Đồ Doanh Thu</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{getTimeRangeLabel()}</p>
            </div>
          </div>
          
          {/* Custom Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:border-emerald-500/50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Calendar className="h-4 w-4 text-emerald-500" />
              <span>{getCurrentTimeRangeText()}</span>
              <ChevronDown 
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-xl z-50 overflow-hidden">
                {timeRangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onTimeRangeChange(option.value as TimeRange);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 ${
                      timeRange === option.value 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="font-medium">{option.label}</span>
                    {timeRange === option.value && (
                      <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tăng trưởng</span>
            </div>
            <p className={`text-lg font-bold ${growthPercentage >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {growthPercentage >= 0 ? '+' : ''}{growthPercentage.toFixed(1)}%
            </p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{getAverageLabel()}</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {loading ? (
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                formatCurrency(averageRevenue)
              )}
            </p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{getTotalLabel()}</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {loading ? (
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                formatCurrency(totalRevenue)
              )}
            </p>
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-80 w-full">
          {loading ? (
            <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse flex items-center justify-center">
              <div className="text-gray-500 dark:text-gray-400">Đang tải biểu đồ...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={displayData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => `${value / 1000000}M`}
                  width={60}
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }} />
                <Bar 
                  dataKey="revenue" 
                  fill="url(#revenueGradient)"
                  radius={[8, 8, 0, 0]} 
                  barSize={40}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-emerald-500/20 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
} 