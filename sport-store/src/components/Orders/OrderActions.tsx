"use client";

import { useCart } from "@/app/context/CartContext";
import { useCustomer } from "@/app/context/CustomerContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePaymentMethod } from "@/app/context/PaymentMethodContext"; // Import usePaymentMethod

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export default function OrderActions() {
  const { clearCart, cartItems } = useCart(); // Lấy cartItems từ CartContext
  const { customer } = useCustomer(); // Lấy customer từ CustomerContext
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { paymentMethod } = usePaymentMethod(); // Sử dụng usePaymentMethod

  // Xử lý khi nhấn "Hủy Bỏ"
  const handleCancel = () => {
    clearCart(); // Xóa toàn bộ giỏ hàng
    router.push("/"); // Điều hướng về trang chủ (hoặc trang khác tùy ý)
  };

  // Xử lý khi nhấn "Tạo Đơn Hàng"
  const handleCreateOrder = async () => {
    setIsLoading(true);
    try {
      // Log dữ liệu cartItems để kiểm tra
      console.log("Cart Items trước khi tạo đơn hàng:", cartItems);

      const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
      if (!token) {
        throw new Error("Bạn cần đăng nhập để tạo đơn hàng");
      }

      // Kiểm tra kiểu dữ liệu của cartItems
      console.log("Type of cartItems:", typeof cartItems);
      console.log("First item in cartItems:", cartItems[0]);

      // Tính tổng giá tiền
      const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Tạo orderData từ cartItems
      const orderData = {
        items: cartItems.map((item: CartItem) => ({
          product: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size || null,
          color: item.color || null,
        })),
        paymentMethod: paymentMethod, // Sử dụng giá trị từ usePaymentMethod
        shippingAddress: {
          fullName: customer.name || "Khách hàng", // Lấy từ customer hoặc giá trị mặc định
          phone: customer.phone || "Chưa cung cấp", // Lấy từ customer hoặc giá trị mặc định
          address: customer.address || "Chưa cung cấp", // Lấy từ customer hoặc giá trị mặc định
          city: customer.province?.name || "Chưa cung cấp", // Lấy từ customer hoặc giá trị mặc định
          postalCode: "700000", // Giá trị mặc định
        },
        totalPrice: totalPrice, // Thêm trường totalPrice
      };

      // Log orderData để kiểm tra
      console.log("Order Data gửi lên server:", orderData);

      // Gửi request tạo đơn hàng lên server
      const response = await fetch("http://localhost:4000/api/orders/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
        body: JSON.stringify(orderData),
      });

      // Kiểm tra phản hồi từ server
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi khi tạo đơn hàng");
      }

      const data = await response.json();
      console.log("Đơn hàng đã được tạo:", data);

      clearCart();

      // Hiển thị popup thông báo
      window.alert("Đơn hàng đã được tạo thành công!"); // Popup thông báo
      window.location.reload(); // Làm mới trang
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      if (error instanceof Error) {
        alert(error.message || "Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
      } else {
        alert("Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-4 mt-6">
      {/* Button Hủy Bỏ */}
      <button
        onClick={handleCancel}
        className="px-6 py-2 bg-gray-300 text-black rounded-lg font-medium hover:bg-gray-400 transition"
      >
        Hủy Bỏ
      </button>

      {/* Button Tạo Đơn Hàng */}
      <button
        onClick={handleCreateOrder}
        disabled={isLoading}
        className={`px-6 py-2 bg-black text-white rounded-lg font-medium ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800 transition"
        }`}
      >
        {isLoading ? "Đang tạo..." : "Tạo Đơn Hàng"}
      </button>
    </div>
  );
}