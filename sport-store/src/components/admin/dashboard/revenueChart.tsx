import { useState, useEffect } from 'react';
import { getRevenue } from '@/lib/api';
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { ChartData, ChartOptions } from 'chart.js';

interface RevenueData {
  labels: string[];
  data: number[];
  totalOrders: number;
  totalRevenue: number;
  medians: number[];
  currentMedian: number;
}

interface ApiResponse {
  success: boolean;
  data: RevenueData;
}

type TimeRange = 'day' | 'month' | 'year';

export default function RevenueChart() {
  const [chartData, setChartData] = useState<RevenueData>({
    labels: [],
    data: [],
    totalOrders: 0,
    totalRevenue: 0,
    medians: [],
    currentMedian: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('day');

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const data = await getRevenue(timeRange) as ApiResponse;
        if (data?.success) {
          setChartData(data.data);
        } else {
          console.warn('Không có dữ liệu doanh thu');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu doanh thu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [timeRange]);

  const formatLabels = (labels: string[], range: TimeRange) => {
    return labels.map(label => {
      switch (range) {
        case 'day':
          return `Ngày ${label}`;
        case 'month':
          return `Tháng ${label}`;
        case 'year':
          return `Năm ${label}`;
        default:
          return label;
      }
    });
  };

  const calculateTotalRevenue = () => {
    if (timeRange === 'day') {
      // Lấy doanh thu của ngày hiện tại (phần tử cuối cùng trong mảng data)
      return chartData.data[chartData.data.length - 1] || 0;
    }
    return chartData.totalRevenue;
  };

  const calculateMedianRevenue = () => {
    if (timeRange === 'day') {
      // Lấy trung vị của ngày hiện tại (phần tử cuối cùng trong mảng medians)
      return chartData.medians[chartData.medians.length - 1] || 0;
    }
    return chartData.currentMedian;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatYAxisValue = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    return `${value}`;
  };

  const data: ChartData<'bar'> = {
    labels: formatLabels(chartData.labels, timeRange),
    datasets: [
      {
        data: chartData.data,
        backgroundColor: chartData.data.map((value, index) => {
          // Ngày không có doanh thu
          if (value === 0) return '#E5E7EB';
          
          // Ngày mới nhất (index cuối cùng)
          if (index === chartData.data.length - 1) return '#232121';
          
          // Tìm giá trị cao nhất trong 6 ngày còn lại
          const maxValue = Math.max(...chartData.data.slice(0, -1));
          
          // Nếu là ngày có doanh thu cao nhất trong 6 ngày còn lại
          if (value === maxValue) return '#FF4D4D';
          
          // Các ngày còn lại
          return '#ECECEC';
        }),
        borderRadius: 15,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return value === 0 ? 'Không có đơn hàng' : formatCurrency(value);
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            weight: 600,
          },
        },
        grid: {
          display: false,
        },
        afterFit: (scaleInstance) => {
          scaleInstance.height = 50; // Tăng chiều cao để dễ hover
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            weight: 600,
          },
          callback: (value) => formatYAxisValue(value as number),
          stepSize: (() => {
            const max = Math.max(...chartData.data);
            if (max >= 1000000000) { // Nếu max >= 1B
              return 1000000000; // Chia mỗi bước 1B
            } else if (max >= 100000000) { // Nếu max >= 100M
              return 100000000; // Chia mỗi bước 100M
            } else if (max >= 10000000) { // Nếu max >= 10M
              return 10000000; // Chia mỗi bước 10M
            } else if (max >= 1000000) { // Nếu max >= 1M
              return 1000000; // Chia mỗi bước 1M
            }
            return 100000; // Mặc định chia mỗi bước 100K
          })()
        },
        grid: {
          color: "#ECECEC",
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    }
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row items-center md:items-start h-[400px]">
      <div className="flex-1 space-y-4">
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === 'day' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => handleTimeRangeChange('day')}
          >
            Ngày
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === 'month' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => handleTimeRangeChange('month')}
          >
            Tháng
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === 'year' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => handleTimeRangeChange('year')}
          >
            Năm
          </button>
        </div>
        <h3 className="text-2xl font-bold">Tổng Doanh Thu</h3>
        <p className="text-3xl font-bold text-[#FF4D4D]">
          {formatCurrency(calculateTotalRevenue())}
        </p>
        <h3 className="text-2xl font-bold mt-2">Trung Vị</h3>
        <p className="text-2xl font-bold text-[#4EB09D]">
          {formatCurrency(calculateMedianRevenue())}
        </p>
      </div>

      <div className="flex-1 h-[350px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
} 