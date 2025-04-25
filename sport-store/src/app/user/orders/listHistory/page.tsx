"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Order, OrderStatus } from "@/types/order";

interface ApiResponse {
  success: boolean;
  message?: string;
  data: Order[];
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchWithAuth("/orders/user") as ApiResponse;
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch orders");
        }
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
      {orders.length === 0 ? (
        <div className="text-center text-gray-500">
          Bạn chưa có đơn hàng nào
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">
                    Đơn hàng #{order.shortId}
                  </h2>
                  <p className="text-gray-500">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </p>
                  <p className="text-gray-600 mt-2">
                    {order.user?.fullname || "Không có dữ liệu"} - {order.phone}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.street}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.province}
                  </p>
                  <p className="text-gray-600">
                    Tổng tiền: {order.totalAmount.toLocaleString()} VNĐ
                  </p>
                  <p className="text-gray-600">
                    Phương thức thanh toán: {order.paymentMethod}
                  </p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                    order.status === OrderStatus.CONFIRMED ? 'bg-blue-100 text-blue-800' :
                    order.status === OrderStatus.SHIPPED ? 'bg-purple-100 text-purple-800' :
                    order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status === OrderStatus.PENDING ? 'Chờ xác nhận' :
                     order.status === OrderStatus.CONFIRMED ? 'Đã xác nhận' :
                     order.status === OrderStatus.SHIPPED ? 'Đang giao hàng' :
                     order.status === OrderStatus.DELIVERED ? 'Đã giao hàng' :
                     'Đã hủy'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}