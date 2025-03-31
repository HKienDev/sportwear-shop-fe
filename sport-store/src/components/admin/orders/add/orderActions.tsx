"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useCart } from "@/context/cartContext";
import { usePaymentMethod } from "@/context/paymentMethodContext";
import { useShippingMethod } from "@/context/shippingMethodContext";
import { useCustomer } from "@/context/customerContext";
import { checkUserByPhone } from "@/utils/checkUserByPhone";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: {
      main: string;
      sub: string[];
    };
    shortId: string;
  };
}

interface User {
  _id: string;
  email: string;
  username: string;
  fullname: string;
  avatar: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  membershipLevel: string;
  totalSpent: number;
  orderCount: number;
}

interface OrderActionsProps {
  onClose: () => void;
  onResetForm: () => void;
}

interface OrderData {
  items: Array<{
    product: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  totalPrice: number;
  paymentMethod: "COD" | "Stripe";
  phone: string;
  shippingMethod: {
    method: string;
    expectedDate: string;
    courier: string;
    trackingId: string;
    fee: number;
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
  userId?: string;
}

export default function OrderActions({ onClose, onResetForm }: OrderActionsProps) {
  const router = useRouter();
  const { items: cartItems, clearCart } = useCart();
  const { customer } = useCustomer();
  const { paymentMethod } = usePaymentMethod();
  const { shippingMethod } = useShippingMethod();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateOrder = async () => {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!customer.name || !customer.phone || !customer.address || !customer.province || !customer.district || !customer.ward) {
        toast.error("Vui lòng nhập đầy đủ thông tin khách hàng");
        return;
      }

      if (!cartItems?.length) {
        toast.error("Vui lòng thêm sản phẩm vào đơn hàng");
        return;
      }

      if (!paymentMethod) {
        toast.error("Vui lòng chọn phương thức thanh toán");
        return;
      }

      if (!shippingMethod) {
        toast.error("Vui lòng chọn phương thức vận chuyển");
        return;
      }

      setIsLoading(true);

      // Kiểm tra xem số điện thoại có trùng với user nào không
      const existingUser = await checkUserByPhone(customer.phone) as User | null;
      console.log("🔹 [handleCreateOrder] Existing user check result:", existingUser);

      // Tính tổng tiền
      const subtotal = cartItems.reduce((total: number, item: CartItem) => {
        return total + (item.product.price * item.quantity);
      }, 0);

      // Phí vận chuyển
      const shippingFee = shippingMethod === "Express" ? 50000 : shippingMethod === "SameDay" ? 100000 : 30000;

      // Tổng cộng
      const total = subtotal + shippingFee;

      // Tạo đơn hàng
      const orderData: OrderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalPrice: total,
        paymentMethod: paymentMethod as "COD" | "Stripe",
        phone: customer.phone,
        shippingMethod: {
          method: shippingMethod,
          expectedDate: "3-5 ngày",
          courier: "Giao hàng nhanh",
          trackingId: `TK${Date.now()}`,
          fee: shippingFee,
        },
        shippingAddress: {
          fullName: customer.name,
          phone: customer.phone,
          address: customer.address,
          city: customer.province.name,
          district: customer.district.name,
          ward: customer.ward.name,
          postalCode: "700000"
        }
      };

      // Thêm userId nếu tìm thấy user
      if (existingUser) {
        orderData.userId = existingUser._id;
        console.log("🔹 [handleCreateOrder] Adding userId to order:", existingUser._id);
      }

      // Log dữ liệu gửi đi để debug
      console.log("🔹 [handleCreateOrder] Request data:", JSON.stringify(orderData, null, 2));

      const { data: responseData } = await fetchWithAuth("/orders/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      console.log("✅ [handleCreateOrder] Success response:", responseData);
      
      // Hiển thị thông báo thành công với tên người dùng nếu có
      toast.success(
        existingUser 
          ? `Tạo đơn hàng thành công cho khách hàng ${existingUser.username}!`
          : "Tạo đơn hàng thành công cho khách vãng lai!"
      );

      clearCart();
      router.push("/admin/orders/list");
    } catch (error) {
      console.error("❌ [handleCreateOrder] Error:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    clearCart();
    onResetForm();
    toast.success("Đã làm mới form");
  };

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={onClose}>
        Hủy
      </Button>
      <Button variant="outline" onClick={handleReset}>
        Làm mới
      </Button>
      <Button 
        onClick={handleCreateOrder} 
        disabled={isLoading || !cartItems?.length || !paymentMethod || !shippingMethod}
      >
        {isLoading ? "Đang xử lý..." : "Tạo đơn hàng"}
      </Button>
    </div>
  );
}