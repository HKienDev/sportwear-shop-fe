"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/types/order";
import OrderDetails from "@/components/admin/orders/details/orderDetails";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const OrderDetailsPage = ({ params }: OrderDetailsPageProps) => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        // Kiểm tra quyền admin
        const { data: userData } = await fetchWithAuth("/auth/check");
        console.log("User data:", userData);

        if (!userData.user || userData.user.role !== "admin") {
          router.push("/user/auth/login");
          return;
        }

        // Lấy thông tin đơn hàng
        const { data: orderData } = await fetchWithAuth(`/orders/admin/${orderId}`);
        console.log("Order data:", orderData);
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order details:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Đã xảy ra lỗi khi tải thông tin đơn hàng");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, router]);

  if (isLoading) {
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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">CHI TIẾT ĐƠN HÀNG</h1>
      <div className="max-w-7xl mx-auto">
        <OrderDetails
          order={order}
          orderId={order._id}
        />
      </div>
    </div>
  );
};

export default OrderDetailsPage; 