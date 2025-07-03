export interface RevenueData {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  growth: {
    orders: number;
    revenue: number;
    customers: number;
    products: number;
  };
}

export interface BestSellingProduct {
  _id: string;
  name: string;
  image?: string;
  category: string;
  totalSales: number;
  sku: string;
  growthRate: number;
}

export interface RecentOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  progress: number;
  createdAt: string;
  originAddress: string;
  destinationAddress: string;
  statusHistory: Array<{
    status: string;
    updatedAt: string;
    updatedBy: string;
    note: string;
    _id: string;
  }>;
}

export interface DashboardData {
  bestSellingProducts: BestSellingProduct[];
  // ... other dashboard data
} 