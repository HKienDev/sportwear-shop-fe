"use client";

import { useParams } from "next/navigation";
import OrderDetails from "@/components/admin/orders/details/orderDetails";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { order, loading, error, fetchOrderDetails } = useOrderDetails(orderId);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
    router.push('/admin/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="relative">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-20"></div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-slate-700">Đang tải thông tin đơn hàng...</h3>
                <p className="text-sm text-slate-500">Vui lòng chờ trong giây lát</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-red-600">Có lỗi xảy ra</h3>
                <p className="text-sm text-slate-600 max-w-md">{error}</p>
                <button 
                  onClick={fetchOrderDetails} 
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Loader2 className="w-4 h-4" />
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="bg-amber-100 p-4 rounded-full">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-amber-600">Không tìm thấy đơn hàng</h3>
                <p className="text-sm text-slate-600">Đơn hàng có thể đã bị xóa hoặc không tồn tại</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Đảm bảo order không phải null trước khi render
  const orderData = order;

  return (
    <div className="min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header với nút back */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                Chi Tiết Đơn Hàng
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Quản lý và theo dõi trạng thái đơn hàng
              </p>
            </div>
          </div>
          
          {/* Main content */}
          <OrderDetails order={orderData} orderId={orderData._id} />
        </div>
      </div>
    </div>
  );
}