"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
}

interface OrderActionsProps {
  selectedProducts: Product[];
  onClose: () => void;
}

interface OrderData {
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  shippingMethod: {
    method: string;
    expectedDate: string;
    courier: string;
    trackingId: string;
  };
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    postalCode: string;
  };
  phone: string;
}

export default function OrderActions({ selectedProducts, onClose }: OrderActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateOrder = async () => {
    try {
      setIsLoading(true);

      // Tính toán tổng giá trị đơn hàng và tạo danh sách items
      const orderItems = selectedProducts.map(product => ({
        product: product._id,
        quantity: 1,
        price: product.discountPrice || product.price
      }));

      const totalPrice = orderItems.reduce((sum, item) => sum + item.price, 0);

      // Tạo dữ liệu đơn hàng
      const orderData: OrderData = {
        items: orderItems,
        totalPrice,
        paymentMethod: "COD",
        paymentStatus: "pending",
        status: "pending",
        shippingMethod: {
          method: "Giao hàng tiêu chuẩn",
          expectedDate: "15/03/2025 - 17/03/2025",
          courier: "Viettel Post",
          trackingId: "VTP" + Math.random().toString(36).substr(2, 9).toUpperCase()
        },
        shippingAddress: {
          fullName: "Nguyễn Văn A",
          phone: "0123456789",
          address: "123 Đường ABC",
          city: "Hồ Chí Minh",
          district: "Quận 1",
          ward: "Phường Bến Nghé",
          postalCode: "700000"
        },
        phone: "0123456789"
      };

      // Gọi API tạo đơn hàng
      const response = await fetchWithAuth("/orders/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Có lỗi xảy ra khi tạo đơn hàng");
      }

      const result = await response.json();
      
      toast.success("Tạo đơn hàng thành công!");
      router.refresh();
      onClose();
      router.push(`/admin/orders/${result.order._id}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Lỗi: ${error.message}`);
      } else {
        toast.error("Có lỗi xảy ra khi tạo đơn hàng");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-4 mt-4">
      <Button
        variant="outline"
        onClick={onClose}
        disabled={isLoading}
      >
        Hủy
      </Button>
      <Button
        onClick={handleCreateOrder}
        disabled={isLoading || selectedProducts.length === 0}
      >
        {isLoading ? "Đang xử lý..." : "Tạo đơn hàng"}
      </Button>
    </div>
  );
}