"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Order } from "@/types/order";

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
                    {order.shippingAddress.fullName} - {order.shippingAddress.phone}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.address.province.name}, {order.shippingAddress.address.district.name}, {order.shippingAddress.address.ward.name}
                  </p>
                  <p className="text-gray-600">
                    Tổng tiền: {order.totalPrice.toLocaleString()} VNĐ
                  </p>
                  <p className="text-gray-600">
                    Phương thức thanh toán: {order.paymentMethod}
                  </p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status === 'pending' ? 'Chờ xác nhận' :
                     order.status === 'processing' ? 'Đang xử lý' :
                     order.status === 'shipped' ? 'Đang giao hàng' :
                     order.status === 'delivered' ? 'Đã giao hàng' :
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