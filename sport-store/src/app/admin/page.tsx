"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import Stats from "@/components/admin/dashboard/stats";
import RevenueChart from "@/components/admin/dashboard/revenueChart";
import RecentOrders from "@/components/admin/dashboard/recentOrders";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Trang Quản Trị</h1>
        <p className="text-gray-600">Chào mừng, {user.name}</p>
      </div>

      <div className="space-y-6">
        <Stats />
        
        <div className="space-y-6">
          <RevenueChart />
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}