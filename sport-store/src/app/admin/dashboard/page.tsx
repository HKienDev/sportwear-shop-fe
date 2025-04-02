"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import Stats from "@/components/admin/dashboard/stats";
import RevenueChart from "@/components/admin/dashboard/revenueChart";
import RecentOrders from "@/components/admin/dashboard/recentOrders";
import BestSellingProducts from "@/components/admin/dashboard/bestSellingProducts";
import { getStats, getRevenue, getRecentOrders, getBestSellingProducts } from "@/services/dashboardService";
import type { DashboardStats, RevenueData, RecentOrder, BestSellingProduct } from "@/types/dashboard";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    stats: DashboardStats | null;
    revenue: RevenueData[];
    recentOrders: RecentOrder[];
    bestSellingProducts: BestSellingProduct[];
  }>({
    stats: null,
    revenue: [],
    recentOrders: [],
    bestSellingProducts: []
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && user.role !== "admin") {
      router.push("/");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [stats, revenue, recentOrders, bestSellingProducts] = await Promise.all([
          getStats(),
          getRevenue(),
          getRecentOrders(),
          getBestSellingProducts()
        ]);

        setData({
          stats,
          revenue: revenue || [],
          recentOrders: recentOrders || [],
          bestSellingProducts: bestSellingProducts || []
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchDashboardData();
      // Refresh data every 5 minutes
      const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4EB09D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trang Quản Trị</h1>
              <p className="text-gray-600 mt-1">Chào mừng, {user?.fullname || 'Admin'}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Cập nhật mỗi 5 phút</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Stats Section */}
          <div>
            <Stats data={data.stats} isLoading={isLoading} />
          </div>

          {/* Revenue Chart */}
          <div>
            <RevenueChart data={data.revenue} isLoading={isLoading} />
          </div>

          {/* Orders and Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Đơn Hàng Gần Đây</h2>
                <Link href="/admin/orders" className="text-sm text-[#4EB09D] hover:text-[#2C7A7B] transition-colors">
                  Xem tất cả
                </Link>
              </div>
              <RecentOrders orders={data.recentOrders} isLoading={isLoading} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Sản Phẩm Bán Chạy</h2>
                <Link href="/admin/products" className="text-sm text-[#4EB09D] hover:text-[#2C7A7B] transition-colors">
                  Xem tất cả
                </Link>
              </div>
              <BestSellingProducts products={data.bestSellingProducts} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 