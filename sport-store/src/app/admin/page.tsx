"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import Stats from "@/components/admin/dashboard/stats";
import RevenueChart from "@/components/admin/dashboard/revenueChart";
import RecentOrders from "@/components/admin/dashboard/recentOrders";
import BestSellingProducts from "@/components/admin/dashboard/bestSellingProducts";
import { getRevenue, getRecentOrders, getBestSellingProducts } from "@/services/dashboardService";
import type { RevenueData, RecentOrder, BestSellingProduct } from "@/types/dashboard";

interface DashboardCache {
  revenue: RevenueData[];
  orders: RecentOrder[];
  products: BestSellingProduct[];
  timestamp: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [products, setProducts] = useState<BestSellingProduct[]>([]);
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef<number>(0);
  const dataCacheRef = useRef<DashboardCache | null>(null);
  const FETCH_INTERVAL = 30000; // 30 seconds
  const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    let isMounted = true;

    const fetchDashboardData = async () => {
      const now = Date.now();
      
      // Kiểm tra cache
      if (dataCacheRef.current && now - dataCacheRef.current.timestamp < CACHE_DURATION) {
        if (isMounted) {
          setRevenue(dataCacheRef.current.revenue);
          setOrders(dataCacheRef.current.orders);
          setProducts(dataCacheRef.current.products);
        }
        return;
      }

      // Kiểm tra thời gian giữa các lần fetch
      if (isFetchingRef.current || (now - lastFetchTimeRef.current < FETCH_INTERVAL)) {
        return;
      }

      isFetchingRef.current = true;
      lastFetchTimeRef.current = now;

      try {
        setLoading(true);
        const [revenueData, ordersData, productsData] = await Promise.all([
          getRevenue(),
          getRecentOrders(),
          getBestSellingProducts()
        ]);

        if (isMounted) {
          setRevenue(revenueData);
          setOrders(ordersData);
          setProducts(productsData);
          // Cập nhật cache
          dataCacheRef.current = {
            revenue: revenueData,
            orders: ordersData,
            products: productsData,
            timestamp: now
          };
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (isMounted) {
          setError('Có lỗi xảy ra khi tải dữ liệu dashboard');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          isFetchingRef.current = false;
        }
      }
    };

    if (user) {
      // Initial fetch
      fetchDashboardData();

      // Set up interval for periodic fetches
      const intervalId = setInterval(fetchDashboardData, FETCH_INTERVAL);

      return () => {
        isMounted = false;
        clearInterval(intervalId);
      };
    }
  }, [authLoading, user, router, CACHE_DURATION]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Trang Quản Trị</h1>
        <p className="text-gray-600">Chào mừng, {user.name}</p>
      </div>

      <div className="space-y-6">
        <Stats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart data={revenue} />
          <div className="space-y-6">
            <RecentOrders orders={orders} />
            <BestSellingProducts products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}