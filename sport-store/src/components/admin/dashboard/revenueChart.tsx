import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowRight, ArrowUp, Calendar } from 'lucide-react';
import { useDashboard } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface RevenueData {
  month: string;
  revenue: number;
}

interface TooltipData {
  active?: boolean;
  payload?: Array<{
    payload: RevenueData;
    value: number;
  }>;
}

// Hàm tạo dữ liệu mẫu theo ngày (7 ngày gần nhất)
const generateDailyData = (): RevenueData[] => {
  const today = new Date();
  const result: RevenueData[] = [];
  
  // Tạo dữ liệu cho 7 ngày gần nhất, từ cũ đến mới
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Định dạng ngày: DD/MM
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const formattedDate = `${day}/${month}`;
    
    // Tạo doanh thu ngẫu nhiên từ 3.5M đến 6.5M
    const revenue = Math.floor(Math.random() * 3000000) + 3500000;
    
    result.push({
      month: formattedDate,
      revenue
    });
  }
  
  return result;
};

// Hàm tạo dữ liệu mẫu theo tháng (12 tháng gần nhất)
const generateMonthlyData = (): RevenueData[] => {
  const today = new Date();
  const result: RevenueData[] = [];
  
  // Tạo dữ liệu cho 12 tháng gần nhất, từ cũ đến mới
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    
    // Định dạng tháng: Tháng MM/YYYY
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedMonth = `Tháng ${month}/${year}`;
    
    // Tạo doanh thu ngẫu nhiên từ 25M đến 55M
    const revenue = Math.floor(Math.random() * 30000000) + 25000000;
    
    result.push({
      month: formattedMonth,
      revenue
    });
  }
  
  return result;
};

// Hàm tạo dữ liệu mẫu theo năm (7 năm gần nhất)
const generateYearlyData = (): RevenueData[] => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const result: RevenueData[] = [];
  
  // Tạo dữ liệu cho 7 năm gần nhất, từ cũ đến mới
  for (let i = 6; i >= 0; i--) {
    const year = currentYear - i;
    
    // Tạo doanh thu ngẫu nhiên từ 250M đến 550M
    const revenue = Math.floor(Math.random() * 300000000) + 250000000;
    
    result.push({
      month: year.toString(),
      revenue
    });
  }
  
  return result;
};

// Dữ liệu mẫu
const sampleDailyData = generateDailyData();
const sampleMonthlyData = generateMonthlyData();
const sampleYearlyData = generateYearlyData();

type TimeRange = 'day' | 'month' | 'year';

// Màu sắc cho các cột
const COLORS = {
  HIGHEST: '#FF4D4D', // Đỏ cho cột cao nhất
  LATEST: '#232121',  // Xám đậm cho cột ngoài cùng bên phải
  DEFAULT: '#C8C8C8'  // Xám trung bình cho các cột còn lại
};

interface RevenueChartProps {
  chartData?: RevenueData[] | { data: RevenueData[] } | Record<string, number>;
  formatCurrency?: (value: number) => string;
}

export function RevenueChart({ chartData, formatCurrency: externalFormatCurrency }: RevenueChartProps) {
  const { dashboardData, isLoading, error } = useDashboard();
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  // Debug data
  useEffect(() => {
    console.log('Dashboard Data:', dashboardData);
    if (dashboardData && dashboardData.revenue) {
      console.log('Revenue Data:', dashboardData.revenue);
    }
  }, [dashboardData]);

  // Xử lý dữ liệu khi timeRange thay đổi
  useEffect(() => {
    if (isLoading || !dashboardData) return;

    let processedData: RevenueData[] = [];
    setApiError(null);
    
    // Ưu tiên sử dụng chartData từ props nếu có
    if (chartData) {
      if (Array.isArray(chartData)) {
        processedData = chartData;
      } else if (chartData.data && Array.isArray(chartData.data)) {
        processedData = chartData.data;
      } else if (typeof chartData === 'object') {
        try {
          processedData = Object.entries(chartData).map(([month, revenue]) => ({
            month,
            revenue: typeof revenue === 'number' ? revenue : 0
          }));
        } catch (e) {
          console.error('Error converting revenue data:', e);
          setApiError('Lỗi khi xử lý dữ liệu doanh thu');
        }
      }
    } else if (dashboardData.revenue) {
      // Check if revenue is already an array
      if (Array.isArray(dashboardData.revenue)) {
        processedData = dashboardData.revenue;
      } 
      // Check if revenue is in data property (common API response format)
      else if (dashboardData.revenue.data && Array.isArray(dashboardData.revenue.data)) {
        processedData = dashboardData.revenue.data;
      }
      // Check if revenue is an object with month and revenue properties
      else if (typeof dashboardData.revenue === 'object') {
        // Try to convert object to array format
        try {
          processedData = Object.entries(dashboardData.revenue).map(([month, revenue]) => ({
            month,
            revenue: typeof revenue === 'number' ? revenue : 0
          }));
        } catch (e) {
          console.error('Error converting revenue data:', e);
          setApiError('Lỗi khi xử lý dữ liệu doanh thu');
        }
      }
    }

    // Kiểm tra nếu không có dữ liệu thực từ API
    if (processedData.length === 0) {
      console.log('No real revenue data available, using sample data');
      setApiError('Không có dữ liệu doanh thu thực tế, đang sử dụng dữ liệu mẫu');
      
      // Sử dụng dữ liệu mẫu
      switch (timeRange) {
        case 'day':
          processedData = sampleDailyData;
          break;
        case 'year':
          processedData = sampleYearlyData;
          break;
        case 'month':
        default:
          processedData = sampleMonthlyData;
          break;
      }
    }

    setRevenueData(processedData);
  }, [dashboardData, isLoading, timeRange, chartData]);

  // Tìm giá trị cao nhất và chỉ số của nó
  const { maxIndex } = useMemo(() => {
    if (revenueData.length === 0) return { maxValue: 0, maxIndex: -1 };
    
    let max = revenueData[0].revenue;
    let maxIdx = 0;
    
    for (let i = 1; i < revenueData.length; i++) {
      if (revenueData[i].revenue > max) {
        max = revenueData[i].revenue;
        maxIdx = i;
      }
    }
    
    return { maxValue: max, maxIndex: maxIdx };
  }, [revenueData]);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: TooltipData) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
          <p className="font-medium text-gray-800">{payload[0].payload.month}</p>
          <p className="text-red-600 font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Format currency function
  const formatCurrency = (value: number) => {
    if (externalFormatCurrency) {
      return externalFormatCurrency(value);
    }
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate total revenue
  const calculateTotalRevenue = (data: RevenueData[]) => {
    return data.reduce((total, item) => total + item.revenue, 0);
  };

  // Calculate average daily revenue
  const calculateAverageDailyRevenue = (data: RevenueData[]) => {
    if (data.length === 0) return 0;
    const total = calculateTotalRevenue(data);
    return Math.round(total / data.length);
  };

  // Loading state
  if (isLoading || !dashboardData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tổng Doanh Thu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-80 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tổng Doanh Thu</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Có lỗi xảy ra: {error}</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate statistics
  const totalRevenue = calculateTotalRevenue(revenueData);
  const averageDailyRevenue = calculateAverageDailyRevenue(revenueData);
  
  // Calculate growth percentage (mock data for now)
  const growthPercentage = 5.2;

  // Get title based on time range
  const getTimeRangeTitle = () => {
    switch (timeRange) {
      case 'day':
        return '7 Ngày Gần Nhất';
      case 'year':
        return '7 Năm Gần Nhất';
      case 'month':
      default:
        return '12 Tháng Gần Nhất';
    }
  };

  // Hàm xác định màu cho từng cột
  const getBarColor = (index: number) => {
    // Cột ngoài cùng bên phải (mới nhất)
    if (index === revenueData.length - 1) {
      return COLORS.LATEST;
    }
    // Cột có giá trị cao nhất
    else if (index === maxIndex) {
      return COLORS.HIGHEST;
    }
    // Các cột còn lại
    else {
      return COLORS.DEFAULT;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100 overflow-hidden relative hover:shadow-lg transition-shadow duration-300">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-600 to-indigo-400"></div>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tổng Doanh Thu</h2>
          <div className="flex items-center mt-1">
            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              {formatCurrency(totalRevenue)}
            </p>
            <div className="flex items-center ml-4 px-2 py-1 bg-emerald-50 rounded-full text-emerald-600 text-sm">
              <ArrowUp size={14} />
              <span className="ml-1 font-medium">{growthPercentage}%</span>
            </div>
          </div>
        </div>
        
        {/* Time Range Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{getTimeRangeTitle()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTimeRange('day')}>
              7 Ngày Gần Nhất
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeRange('month')}>
              12 Tháng Gần Nhất
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimeRange('year')}>
              7 Năm Gần Nhất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {apiError && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
          <p>{apiError}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-base font-medium text-gray-500">Trung Bình Mỗi {timeRange === 'day' ? 'Ngày' : timeRange === 'year' ? 'Năm' : 'Tháng'}</h2>
          <p className="text-xl font-semibold text-black mt-1">{formatCurrency(averageDailyRevenue)}</p>
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
        {revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
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
                radius={[6, 6, 0, 0]} 
                barSize={38}
                animationDuration={1500}
              >
                {revenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-center text-muted-foreground">Không có dữ liệu doanh thu</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-center">
        <button className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 transition-colors">
          Xem chi tiết báo cáo doanh thu
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
} 