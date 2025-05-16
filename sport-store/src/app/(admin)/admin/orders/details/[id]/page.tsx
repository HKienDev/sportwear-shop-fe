"use client";

import { useParams } from "next/navigation";
import OrderDetails from "@/components/admin/orders/details/orderDetails";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { order, loading, error, refreshOrder } = useOrderDetails(orderId);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
    router.push('/admin/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">Đang tải thông tin đơn hàng...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-red-500 text-center">{error}</div>
            <button onClick={refreshOrder} className="mt-4 text-blue-500 underline">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">Không tìm thấy thông tin đơn hàng</div>
          </div>
        </div>
      </div>
    );
  }

  // Đảm bảo order không phải null trước khi render
  const orderData = order;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">CHI TIẾT ĐƠN HÀNG</h1>
      <div className="max-w-7xl mx-auto">
        <OrderDetails order={orderData} orderId={orderData._id} />
      </div>
    </div>
  );
}