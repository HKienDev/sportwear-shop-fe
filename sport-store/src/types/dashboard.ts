export interface RevenueData {
  month: string;
  revenue: number;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
}

export interface BestSellingProduct {
  _id: string;
  name: string;
  category: string;
  totalSales: number;
  image: string;
  price: number;
}

export interface RecentOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
} 