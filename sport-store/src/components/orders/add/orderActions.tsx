"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useCart } from "@/app/context/cartContext";
import { usePaymentMethod } from "@/app/context/paymentMethodContext";
import { useShippingMethod } from "@/app/context/shippingMethodContext";
import { useCustomer } from "@/app/context/customerContext";
import { checkUserByPhone } from "@/utils/checkUserByPhone";

interface CartItem {
  cartItemId: string;
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

interface ValidCartItem extends Omit<CartItem, 'size' | 'color'> {
  size: string;
  color: string;
}

interface OrderActionsProps {
  onClose: () => void;
  onResetForm: () => void;
}

interface OrderData {
  items: Array<{
    product: string;  // ID của sản phẩm
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  paymentMethod: "COD" | "Stripe";
  phone: string;
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
  userId?: string;
}

export default function OrderActions({ onClose, onResetForm }: OrderActionsProps) {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { paymentMethod } = usePaymentMethod();
  const { shippingMethod } = useShippingMethod();
  const { customer } = useCustomer();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Vui lòng thêm ít nhất một sản phẩm vào đơn hàng");
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

    // Kiểm tra thông tin khách hàng
    if (!customer.name || !customer.phone || !customer.address || !customer.province || !customer.district || !customer.ward) {
      toast.error("Vui lòng điền đầy đủ thông tin khách hàng");
      return;
    }

    try {
      setIsLoading(true);

      // Kiểm tra xem số điện thoại có trùng với user nào không
      const existingUser = await checkUserByPhone(customer.phone);
      console.log("🔹 [handleCreateOrder] Existing user check result:", existingUser);

      // Lọc ra những item có đầy đủ thông tin và ép kiểu
      const validItems = cartItems.filter((item): item is ValidCartItem => 
        item.size !== undefined && item.color !== undefined
      );
      
      if (validItems.length !== cartItems.length) {
        toast.error("Một số sản phẩm chưa có đầy đủ thông tin size hoặc màu sắc");
        return;
      }

      const totalPrice = validItems.reduce((total, item) => {
        const itemPrice = item.discountPrice || item.price;
        return total + (itemPrice * item.quantity);
      }, 0);

      const orderData: OrderData = {
        items: validItems.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.discountPrice || item.price,
        })),
        totalPrice,
        paymentMethod: paymentMethod as "COD" | "Stripe",
        phone: customer.phone,
        shippingMethod: {
          method: shippingMethod,
          expectedDate: "3-5 ngày",
          courier: "Giao hàng nhanh",
          trackingId: `TK${Date.now()}`,
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

  return (
    <div className="flex gap-4">
      <Button variant="outline" onClick={onClose}>
        Hủy
      </Button>
      <Button variant="outline" onClick={onResetForm}>
        Làm mới
      </Button>
      <Button 
        onClick={handleCreateOrder} 
        disabled={isLoading || cartItems.length === 0 || !paymentMethod || !shippingMethod}
      >
        {isLoading ? "Đang xử lý..." : "Tạo đơn hàng"}
      </Button>
    </div>
  );
}