"use client";

import { useCart } from "@/app/context/cartContext";
import { useCustomer } from "@/app/context/customerContext";
import { useState } from "react";
import Swal from "sweetalert2"; 
import { useRouter } from "next/navigation";
import { usePaymentMethod } from "@/app/context/paymentMethodContext";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface OrderActionsProps {
  onResetForm?: () => void; // Thêm prop reset form
}

export default function OrderActions({ onResetForm }: OrderActionsProps){
  const { clearCart, cartItems } = useCart(); // Lấy cartItems từ CartContext
  const { customer, resetCustomer } = useCustomer(); // Lấy customer và resetCustomer từ CustomerContext
  const [isLoading, setIsLoading] = useState(false);
  const { paymentMethod } = usePaymentMethod(); // Sử dụng usePaymentMethod
  const router = useRouter(); // Sử dụng useRouter

  // Xử lý khi nhấn "Hủy Bỏ"
  const handleCancel = () => {
    resetCustomer(); // Reset thông tin khách hàng
    clearCart(); // Reset giỏ hàng
    onResetForm?.();
  };

  // Xử lý khi nhấn "Tạo Đơn Hàng"
  const handleCreateOrder = async () => {
    try {
      // Kiểm tra thông tin khách hàng
      if (!customer.name || !customer.phone || !customer.address || !customer.province?.name) {
        Swal.fire({
          title: "Lỗi!",
          text: "Vui lòng nhập đầy đủ thông tin khách hàng.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return; // Ngừng xử lý nếu thông tin không đầy đủ
      }

      // Kiểm tra giỏ hàng
      if (cartItems.length === 0) {
        Swal.fire({
          title: "Lỗi!",
          text: "Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return; // Ngừng xử lý nếu giỏ hàng trống
      }

      setIsLoading(true);

      // Chuẩn hóa số điện thoại
      const normalizedPhone = customer.phone.replace(/\s+/g, "").trim();

      // Kiểm tra SĐT với server
      const checkPhoneResponse = await fetch(`http://localhost:4000/api/users/phone/${normalizedPhone}`);
      const phoneData = await checkPhoneResponse.json();

      let userId = null;
      if (!checkPhoneResponse.ok) {
        throw new Error(phoneData.message || "Lỗi kiểm tra SĐT");
      }

      if (phoneData.exists) {
        userId = phoneData.userId; // Lấy ID của user nếu tồn tại
      }

      // Log dữ liệu cartItems để kiểm tra
      console.log("Cart Items trước khi tạo đơn hàng:", cartItems);

      const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
      if (!token) {
        throw new Error("Bạn cần đăng nhập để tạo đơn hàng");
      }

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
          fullName: customer.name,
          phone: normalizedPhone, // Gửi số điện thoại đã chuẩn hóa
          address: customer.address,
          city: customer.province?.name,
          postalCode: "700000", // Giá trị mặc định
        },
        totalPrice: totalPrice, // Thêm trường totalPrice
        user: userId, // Thêm userId nếu có
        phone: normalizedPhone, // Thêm số điện thoại vào req.body
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
      resetCustomer();
      onResetForm?.();
      // Hiển thị popup thông báo thành công
      Swal.fire({
        title: "Thành công!",
        text: "Đơn hàng đã được tạo thành công!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/Admin/Orders/List"); // Chuyển hướng về trang danh sách đơn hàng
      });
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);

      // Hiển thị popup lỗi
      Swal.fire({
        title: "Lỗi!",
        text: error instanceof Error ? error.message : "Đã có lỗi xảy ra khi tạo đơn hàng.",
        icon: "error",
        confirmButtonText: "OK",
      });
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