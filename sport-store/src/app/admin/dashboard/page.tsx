"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import Stats from "@/components/admin/dashboard/stats";
import RevenueChart from "@/components/admin/dashboard/revenueChart";
import RecentOrders from "@/components/admin/dashboard/recentOrders";
import BestSellingProducts from "@/components/admin/dashboard/bestSellingProducts";
import { getStats, getRevenue, getRecentOrders, getBestSellingProducts } from "@/services/dashboardService";
import type { DashboardStatsResponse, RevenueResponse, RecentOrdersResponse, BestSellingProductsResponse } from "@/services/dashboardService";
import Link from "next/link";
import { TOKEN_CONFIG } from "@/config/token";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    stats: DashboardStatsResponse | null;
    revenue: RevenueResponse | null;
    recentOrders: RecentOrdersResponse | null;
    bestSellingProducts: BestSellingProductsResponse | null;
  }>({
    stats: null,
    revenue: null,
    recentOrders: null,
    bestSellingProducts: null
  });

  useEffect(() => {
    const checkAuth = async () => {
      // Kiểm tra token
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      if (!token) {
        console.log('🔑 Không có token, chuyển hướng về trang login');
        await router.push("/auth/login");
        return;
      }

      if (!authLoading && !user) {
        console.log('👤 Không có user, chuyển hướng về trang login');
        await router.push("/auth/login");
        return;
      }

      if (user && user.role !== "admin") {
        console.log('👤 User không phải admin, chuyển hướng về trang user');
        await router.push("/user");
        return;
      }

      if (user && user.role === "admin") {
        console.log('👤 User là admin, bắt đầu fetch data');
        await fetchDashboardData();
      }
    };

    void checkAuth();

    // Refresh data every 5 minutes
    const interval = setInterval(() => {
      if (user && user.role === "admin") {
        void fetchDashboardData();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, authLoading, router]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Kiểm tra token trước khi fetch
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      if (!token) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        router.push("/auth/login");
        return;
      }

      console.log('📊 Fetching dashboard data...');
      
      // Fetch từng API riêng lẻ để dễ debug
      try {
        const stats = await getStats();
        setData(prev => ({ ...prev, stats }));
      } catch (err) {
        console.error("❌ Error fetching stats:", err);
      }

      try {
        const revenue = await getRevenue();
        setData(prev => ({ ...prev, revenue }));
      } catch (err) {
        console.error("❌ Error fetching revenue:", err);
      }

      try {
        const recentOrders = await getRecentOrders();
        setData(prev => ({ ...prev, recentOrders }));
      } catch (err) {
        console.error("❌ Error fetching recent orders:", err);
      }

      try {
        const bestSellingProducts = await getBestSellingProducts();
        setData(prev => ({ ...prev, bestSellingProducts }));
      } catch (err) {
        console.error("❌ Error fetching best selling products:", err);
      }

      console.log('✅ Dashboard data fetched successfully');
    } catch (err) {
      console.error("❌ Error fetching dashboard data:", err);
      setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4EB09D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 max-w-md">
          <p className="font-medium">{error}</p>
        </div>
        <button 
          onClick={() => router.push("/auth/login")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Đăng nhập lại
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Stats stats={data.stats} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Doanh thu</h2>
          <RevenueChart data={data.revenue} />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm bán chạy</h2>
          <BestSellingProducts products={data.bestSellingProducts} />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Đơn hàng gần đây</h2>
        <RecentOrders orders={data.recentOrders} />
      </div>
    </div>
  );
} 