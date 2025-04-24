import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dispatch, SetStateAction } from 'react';

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
  chartData?: ChartData[] | Record<string, number> | { data: ChartData[] } | null;
  formatCurrency: (value: number) => string;
  timeRange: TimeRange;
  onTimeRangeChange: Dispatch<SetStateAction<TimeRange>>;
}

export function RevenueChart({ chartData, formatCurrency, timeRange, onTimeRangeChange }: RevenueChartProps) {
  // Chuyển đổi dữ liệu thành mảng ChartData
  const convertToChartData = (data: RevenueChartProps['chartData']): ChartData[] => {
    if (!data) return [];
    
    if (Array.isArray(data)) {
      return data;
    }
    
    if ('data' in data && Array.isArray(data.data)) {
      return data.data;
    }
    
    if (typeof data === 'object') {
      return Object.entries(data).map(([date, revenue]) => ({
        date,
        revenue: typeof revenue === 'number' ? revenue : 0,
        orderCount: 0
      }));
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

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: TooltipData) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
          <p className="font-medium text-gray-800">{data.date}</p>
          <p className="text-red-600 font-bold">
            {formatCurrency(data.revenue)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Số đơn hàng: {data.orderCount}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100 overflow-hidden relative hover:shadow-lg transition-shadow duration-300">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-600 to-indigo-400"></div>
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Biểu Đồ Doanh Thu</h2>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="day">7 ngày gần nhất</option>
            <option value="month">12 tháng gần nhất</option>
            <option value="year">5 năm gần nhất</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-8">
          <div>
            <h2 className="text-base font-medium text-gray-500">
              {timeRange === 'day' ? 'Trung Bình Mỗi Ngày' : 
               timeRange === 'month' ? 'Trung Bình Mỗi Tháng' : 
               'Trung Bình Mỗi Năm'}
            </h2>
            <p className="text-xl font-semibold text-black mt-1">{formatCurrency(averageRevenue)}</p>
          </div>
          <div>
            <h2 className="text-base font-medium text-gray-500">
              {timeRange === 'day' ? 'Doanh Thu 7 Ngày' : 
               timeRange === 'month' ? 'Doanh Thu 12 Tháng' : 
               'Doanh Thu 5 Năm'}
            </h2>
            <p className="text-xl font-semibold text-black mt-1">{formatCurrency(totalRevenue)}</p>
          </div>
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
            data={displayData}
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
    </div>
  );
} 