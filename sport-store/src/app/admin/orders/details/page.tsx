"use client";

import { notFound, useParams } from "next/navigation";
import OrderDetails from "@/components/admin/orders/details/orderDetails";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Order } from "@/types/order";
import { useEffect, useState } from "react";

async function getOrder(id: string): Promise<Order> {
  try {
    const response = await fetchWithAuth(`/orders/admin/${id}`);
    if (!response.ok) {
      throw new Error("Không thể tải thông tin đơn hàng");
    }
    return response.data;
  } catch {
    notFound();
  }
}

export default function OrderDetailsPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(params.id as string);
        setOrder(data);
      } catch {
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return notFound();
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">CHI TIẾT ĐƠN HÀNG</h1>
      <div className="max-w-7xl mx-auto">
        <OrderDetails
          orderId={order._id}
          status={order.status}
          items={order.items}
          shippingAddress={order.shippingAddress}
          shippingMethod={order.shippingMethod}
          shippingFee={order.shippingFee}
          discount={order.discount}
          paymentMethod={order.paymentMethod}
          paymentStatus={order.paymentStatus}
          createdAt={order.createdAt}
          user={order.user}
        />
      </div>
    </div>
  );
}