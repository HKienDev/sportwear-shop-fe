import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, ArrowUp } from 'lucide-react';

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

interface RevenueChartProps {
  chartData: ChartData[];
  formatCurrency: (value: number) => string;
}

export function RevenueChart({ chartData, formatCurrency }: RevenueChartProps) {
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
  );
} 