import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Dispatch, SetStateAction, useState, useMemo, useCallback, useEffect } from 'react';
import { TrendingUp, Calendar, DollarSign, BarChart3, ChevronDown } from 'lucide-react';

interface RevenueData {
  revenue: ChartData[];
  lastUpdated: string;
}

interface ChartData {
  date: string;
  revenue: number;
  orderCount: number;
  displayDate?: string;
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
  chartData?: ChartData[] | RevenueData | null;
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
  const [debouncedTimeRange, setDebouncedTimeRange] = useState(timeRange);

  // Debounce timeRange changes to prevent spam API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedTimeRange(timeRange);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [timeRange]);

  // Chuyển đổi dữ liệu thành mảng ChartData
  const convertToChartData = (data: RevenueChartProps['chartData']): ChartData[] => {
    if (!data) return [];
    
    // Nếu data là array, trả về trực tiếp
    if (Array.isArray(data)) {
      return data;
    }
    
    // Nếu data là object có property revenue, lấy revenue array
    if (data && typeof data === 'object' && 'revenue' in data) {
      const revenueData = (data as RevenueData).revenue;
      if (Array.isArray(revenueData)) {
        return revenueData;
      }
    }
    
    return [];
  };

  const safeChartData = convertToChartData(chartData);
  
  // Tạo dữ liệu trống cho tất cả các period - Logic chính xác
  const generateEmptyData = useCallback((): ChartData[] => {
    const now = new Date();
    const emptyData: ChartData[] = [];
    
    switch (timeRange) {
      case 'day':
        // 7 ngày gần nhất - từ ngày xa nhất đến ngày gần nhất
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          emptyData.push({
            date: `${day}/${month}/${year}`,
            revenue: 0,
            orderCount: 0
          });
        }
        break;
        
      case 'month':
        // 12 tháng gần nhất - từ tháng xa nhất đến tháng gần nhất
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          emptyData.push({
            date: `${month}/${year}`,
            revenue: 0,
            orderCount: 0
          });
        }
        break;
        
      case 'year':
        // 5 năm gần nhất - từ năm xa nhất đến năm gần nhất
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
  }, [timeRange]);

  // Kết hợp dữ liệu thực với dữ liệu trống
  const combineData = useCallback((realData: ChartData[], emptyData: ChartData[]): ChartData[] => {
    const combined = [...emptyData];
    
    // Cập nhật dữ liệu thực vào các vị trí tương ứng
    realData.forEach(realItem => {
      const index = combined.findIndex(emptyItem => {
        return emptyItem.date === realItem.date;
      });
      if (index !== -1) {
        combined[index] = realItem;
      }
    });
    
    return combined;
  }, []);
  
  // Format date cho hiển thị (tiếng Việt) - Tối ưu cho tất cả period
  const formatDisplayDate = useCallback((dateStr: string, period: TimeRange): string => {
    if (period === 'day') {
      // Format DD/MM/YYYY -> DD/MM/YYYY (giữ nguyên cho ngày)
      return dateStr;
    } else if (period === 'month') {
      // Format MM/YYYY -> "thg M YYYY"
      const [month, year] = dateStr.split('/');
      const monthNum = parseInt(month);
      return `thg ${monthNum} ${year}`;
    } else if (period === 'year') {
      // Format YYYY -> "Năm YYYY"
      return `Năm ${dateStr}`;
    } else {
      return dateStr;
    }
  }, []);

  const emptyData = generateEmptyData();
  const displayData = combineData(safeChartData, emptyData);
  
  // Tạo dữ liệu hiển thị với date đã format
  const displayDataWithFormattedDates = useMemo(() => 
    displayData.map(item => ({
      ...item,
      displayDate: formatDisplayDate(item.date, timeRange)
    })), [displayData, formatDisplayDate, timeRange]);
  


  // Tính tổng doanh thu và trung bình
  const totalRevenue = useMemo(() => 
    displayData.reduce((sum, item) => sum + (item?.revenue || 0), 0), [displayData]);
  const averageRevenue = useMemo(() => 
    displayData.length > 0 ? totalRevenue / displayData.length : 0, [displayData.length, totalRevenue]);

  // Tính phần trăm tăng trưởng
  const calculateGrowth = useCallback(() => {
    if (displayData.length < 2) return 0;
    const currentPeriod = displayData.slice(-1)[0]?.revenue || 0;
    const previousPeriod = displayData.slice(-2)[0]?.revenue || 0;
    if (previousPeriod === 0) return currentPeriod > 0 ? 100 : 0;
    return ((currentPeriod - previousPeriod) / previousPeriod) * 100;
  }, [displayData]);

  const growthPercentage = useMemo(() => calculateGrowth(), [calculateGrowth]);

  // Custom tooltip for the chart
  const CustomTooltip = useCallback(({ active, payload }: TooltipData) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-4 shadow-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{data.displayDate}</p>
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
  }, [formatCurrency]);

  const getTimeRangeLabel = useCallback(() => {
    switch (timeRange) {
      case 'day': return '7 ngày gần nhất';
      case 'month': return '12 tháng gần nhất';
      case 'year': return '5 năm gần nhất';
      default: return '';
    }
  }, [timeRange]);

  const getAverageLabel = useCallback(() => {
    switch (timeRange) {
      case 'day': return 'Trung bình/ngày';
      case 'month': return 'Trung bình/tháng';
      case 'year': return 'Trung bình/năm';
      default: return '';
    }
  }, [timeRange]);

  const getTotalLabel = useCallback(() => {
    switch (timeRange) {
      case 'day': return 'Tổng 7 ngày';
      case 'month': return 'Tổng 12 tháng';
      case 'year': return 'Tổng 5 năm';
      default: return '';
    }
  }, [timeRange]);

  const getCurrentTimeRangeText = useCallback(() => {
    switch (timeRange) {
      case 'day': return '7 ngày';
      case 'month': return '12 tháng';
      case 'year': return '5 năm';
      default: return '';
    }
  }, [timeRange]);

  // Function để tính toán màu sắc cho từng cột
  const getBarColor = useCallback((entry: any, index: number) => {
    const data = displayDataWithFormattedDates;
    if (!data || data.length === 0) return '#ECECEC';

    // Tìm giá trị cao nhất
    const maxRevenue = Math.max(...data.map(item => item.revenue || 0));
    
    // Cột có giá trị cao nhất
    if (entry.revenue === maxRevenue && entry.revenue > 0) {
      return '#FF4D4D';
    }
    
    // Cột ngày mới nhất (cuối cùng)
    if (index === data.length - 1) {
      return '#232121';
    }
    
    // Cột ngày cũ nhất (đầu tiên)
    if (index === 0) {
      return '#C8C8C8';
    }
    
    // Các cột còn lại
    return '#ECECEC';
  }, [displayDataWithFormattedDates]);

  const timeRangeOptions = useMemo(() => [
    { value: 'day', label: '7 ngày' },
    { value: 'month', label: '12 tháng' },
    { value: 'year', label: '5 năm' }
  ], []);

  return (
    <div className="relative group overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Biểu Đồ Doanh Thu</h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{getTimeRangeLabel()}</p>
            </div>
          </div>
          
          {/* Custom Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
              <span className="truncate">{getCurrentTimeRangeText()}</span>
              <ChevronDown 
                className={`h-3 w-3 sm:h-4 sm:w-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-full sm:w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl shadow-xl z-50 overflow-hidden">
                {timeRangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      // Only change if different to prevent unnecessary API calls
                      if (timeRange !== option.value) {
                        onTimeRangeChange(option.value as TimeRange);
                      }
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 text-xs sm:text-sm ${
                      timeRange === option.value 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="font-medium truncate">{option.label}</span>
                    {timeRange === option.value && (
                      <div className="ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-200">
            <div className="flex items-center space-x-2 mb-1.5 sm:mb-2">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Tăng trưởng</span>
            </div>
            <p className={`text-sm sm:text-lg font-bold ${growthPercentage >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {growthPercentage >= 0 ? '+' : ''}{growthPercentage.toFixed(2)}%
            </p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200">
            <div className="flex items-center space-x-2 mb-1.5 sm:mb-2">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{getAverageLabel()}</span>
            </div>
            <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
              {loading ? (
                <div className="h-4 sm:h-6 w-16 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                formatCurrency(averageRevenue)
              )}
            </p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-200 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-1.5 sm:mb-2">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{getTotalLabel()}</span>
            </div>
            <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
              {loading ? (
                <div className="h-4 sm:h-6 w-16 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                formatCurrency(totalRevenue)
              )}
            </p>
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-64 sm:h-80 w-full">
          {loading ? (
            <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg sm:rounded-xl animate-pulse flex items-center justify-center">
              <div className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Đang tải biểu đồ...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={displayDataWithFormattedDates}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" opacity={0.5} />
                <XAxis 
                  dataKey="displayDate" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 500 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => `${value / 1000000}M`}
                  width={50}
                  tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 500 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }} />
                <Bar 
                  dataKey="revenue" 
                  radius={[4, 4, 0, 0]} 
                  barSize={20}
                  animationDuration={1500}
                  fill="#ECECEC"
                >
                  {displayDataWithFormattedDates.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry, index)} />
                  ))}
                </Bar>
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