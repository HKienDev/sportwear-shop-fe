import type { RevenueData, RecentOrder } from '@/types/dashboard';

type TimeRange = 'day' | 'month' | 'year';

/**
 * Format currency theo định dạng Việt Nam
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Format số lượng với đơn vị
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

/**
 * Format percentage với dấu + hoặc -
 */
export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

/**
 * Lấy màu cho percentage dựa trên giá trị
 */
export const getPercentageColor = (value: number): string => {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
};

/**
 * Xử lý dữ liệu doanh thu theo khoảng thời gian
 */
export const processRevenueData = (data: RevenueData[], period: TimeRange): RevenueData[] => {
  if (!data || !Array.isArray(data)) return [];

  // Nếu có dữ liệu từ API, sử dụng trực tiếp
  if (data.length > 0) {
    return data;
  }

  let filteredData: RevenueData[] = [];

  switch (period) {
    case 'day':
      // Lấy 7 ngày gần nhất
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      filteredData = last7Days.map(date => {
        const [year, month, day] = date.split('-');
        const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
        const existingData = data.find(item => item.date === formattedDate);
        return {
          date: formattedDate,
          revenue: existingData ? existingData.revenue : 0,
          orderCount: existingData ? existingData.orderCount : 0
        };
      });
      break;

    case 'month':
      // Lấy 12 tháng gần nhất
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toISOString().slice(0, 7);
      }).reverse();

      filteredData = last12Months.map(date => {
        const [year, month] = date.split('-');
        const formattedDate = `${month.padStart(2, '0')}/${year}`;
        const existingData = data.find(item => item.date === formattedDate);
        return {
          date: formattedDate,
          revenue: existingData ? existingData.revenue : 0,
          orderCount: existingData ? existingData.orderCount : 0
        };
      });
      break;

    case 'year':
      // Lấy 5 năm gần nhất
      const last5Years = Array.from({ length: 5 }, (_, i) => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - i);
        return date.getFullYear().toString();
      }).reverse();

      filteredData = last5Years.map(year => {
        const existingData = data.find(item => item.date === year);
        return {
          date: year,
          revenue: existingData ? existingData.revenue : 0,
          orderCount: existingData ? existingData.orderCount : 0
        };
      });
      break;
  }

  return filteredData;
};

/**
 * Tính toán tiến độ đơn hàng dựa trên trạng thái
 */
export const calculateOrderProgress = (status: string): number => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 25;
    case 'confirmed':
      return 50;
    case 'shipped':
      return 75;
    case 'delivered':
      return 100;
    case 'cancelled':
      return 0;
    default:
      return 0;
  }
};

/**
 * Format trạng thái đơn hàng sang tiếng Anh
 */
export const getStatusText = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'processing':
      return 'Processing';
    case 'shipped':
      return 'Shipped';
    case 'out_for_delivery':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

/**
 * Lấy màu cho trạng thái đơn hàng
 */
export const getStatusColor = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'secondary';
    case 'confirmed':
    case 'processing':
      return 'default';
    case 'shipped':
    case 'out_for_delivery':
      return 'outline';
    case 'delivered':
      return 'default';
    case 'cancelled':
      return 'destructive';
    default:
      return 'secondary';
  }
};

/**
 * Interface cho dữ liệu đơn hàng thô từ API
 */
interface RawOrderData {
  _id?: string;
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  total?: number;
  status?: string;
  createdAt?: string;
  originAddress?: string;
  destinationAddress?: string;
  statusHistory?: Array<{
    status: string;
    updatedAt: string;
    updatedBy: string;
    note: string;
    _id: string;
  }>;
}

/**
 * Validate và sanitize dữ liệu đơn hàng
 */
export const sanitizeOrderData = (order: RawOrderData): RecentOrder => {
  return {
    _id: order._id || '',
    orderNumber: order.orderNumber || 'N/A',
    customerName: order.customerName || 'Unknown',
    customerEmail: order.customerEmail || 'N/A',
    total: order.total || 0,
    status: order.status || 'pending',
    progress: calculateOrderProgress(order.status || 'pending'),
    createdAt: order.createdAt || new Date().toISOString(),
    originAddress: order.originAddress || 'VJUSPORT, Lưu Hữu Phước, Cầu Diễn, Nam Từ Liêm, Hà Nội',
    destinationAddress: order.destinationAddress || 'No information',
    statusHistory: order.statusHistory || []
  };
};

/**
 * Tạo dữ liệu fallback cho dashboard stats
 */
export const createFallbackStats = () => ({
  totalOrders: 0,
  totalRevenue: 0,
  totalCustomers: 0,
  totalProducts: 0,
  growth: {
    orders: 0,
    revenue: 0,
    customers: 0,
    products: 0
  }
});

/**
 * Validate dữ liệu dashboard
 */
export const validateDashboardData = (data: unknown): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  const requiredKeys = ['stats', 'revenue', 'bestSellingProducts', 'recentOrders'];
  return requiredKeys.every(key => key in data);
};

/**
 * Safe number conversion
 */
export const safeNumber = (value: unknown, defaultValue = 0): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
};

/**
 * Safe string conversion
 */
export const safeString = (value: unknown, defaultValue = ''): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return defaultValue;
}; 