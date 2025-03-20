"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/types/order";
import OrderDetails from "@/components/admin/orders/details/orderDetails";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import CancelOrder from "@/components/admin/orders/details/cancelOrder";

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.shortId}</h1>
        <div className="flex gap-4">
          <CancelOrder 
            orderId={order._id} 
            status={order.status} 
            items={order.items.map(item => ({
              product: {
                _id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                images: {
                  main: item.product.images?.[0] || '',
                  sub: item.product.images?.slice(1) || []
                }
              },
              quantity: item.quantity,
              price: item.product.price
            }))} 
          />
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <OrderDetails
          orderId={order._id}
          status={order.status}
          items={order.items}
          shippingAddress={order.customer?.address || {
            province: '',
            district: '',
            ward: '',
            street: ''
          }}
          shippingMethod={order.shippingMethod}
          shippingFee={order.shippingFee}
          discount={0}
          paymentMethod={order.paymentMethod}
          paymentStatus={order.status}
          createdAt={order.createdAt}
          user={order.customer?._id || ''}
          totalPrice={order.totalPrice}
        />
      </div>
    </div>
  );
};

export default OrderDetailsPage; 