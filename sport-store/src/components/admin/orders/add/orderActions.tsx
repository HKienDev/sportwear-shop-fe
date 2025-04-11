"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useCart } from "@/context/cartContext";
import { usePaymentMethod } from "@/context/paymentMethodContext";
import { useShippingMethod, ShippingMethod } from "@/context/shippingMethodContext";
import { useCustomer } from "@/context/customerContext";
import { checkUserByPhone } from "@/utils/checkUserByPhone";
import { CartItem } from "@/types/cart";

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
    sku: string;
    quantity: number;
    color?: string;
    size?: string;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: {
      province: {
        name: string;
        code: string;
      };
      district: {
        name: string;
        code: string;
      };
      ward: {
        name: string;
        code: string;
      };
    };
  };
  paymentMethod: 'cash' | 'banking' | 'momo' | 'stripe';
  shippingMethod: string;
  couponCode?: string;
  note?: string;
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
        return total + (item.price * item.quantity);
      }, 0);

      // Phí vận chuyển
      const shippingFee = shippingMethod === ShippingMethod.EXPRESS ? 50000 : 
                         shippingMethod === ShippingMethod.SAME_DAY ? 100000 : 
                         30000;

      // Tổng cộng
      const total = subtotal + shippingFee;

      // Tạo đơn hàng
      const orderData: OrderData = {
        items: cartItems.map(item => ({
          sku: item.sku,
          quantity: item.quantity,
          color: item.color,
          size: item.size
        })),
        shippingAddress: {
          fullName: customer.name,
          phone: customer.phone,
          address: {
            province: {
              name: customer.province.name,
              code: customer.province.code
            },
            district: {
              name: customer.district.name,
              code: customer.district.code
            },
            ward: {
              name: customer.ward.name,
              code: customer.ward.code
            }
          }
        },
        paymentMethod: paymentMethod as 'cash' | 'banking' | 'momo' | 'stripe',
        shippingMethod: shippingMethod,
        note: customer.note
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