"use client";

import { useCart } from "@/app/context/cartContext";
import { useCustomer } from "@/app/context/customerContext";
import { useState } from "react";
import Swal from "sweetalert2"; 
import { useRouter } from "next/navigation";
import { usePaymentMethod } from "@/app/context/paymentMethodContext";
import { useShippingMethod } from "@/app/context/shippingMethodContext";
import { Button } from "@/components/ui/button";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  discountPrice?: number;
}

interface OrderActionsProps {
  onResetForm?: () => void; // Thêm prop reset form
}

export default function OrderActions({ onResetForm }: OrderActionsProps){
  const { clearCart, cartItems } = useCart(); // Lấy cartItems từ CartContext
  const { customer, resetCustomer } = useCustomer(); // Lấy customer và resetCustomer từ CustomerContext
  const [isLoading, setIsLoading] = useState(false);
  const { paymentMethod } = usePaymentMethod(); // Sử dụng usePaymentMethod
  const { shippingMethod } = useShippingMethod();
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
      console.log("Số điện thoại gốc:", customer.phone);
      console.log("Số điện thoại đã chuẩn hóa:", normalizedPhone);

      // Kiểm tra SĐT với server
      const checkPhoneResponse = await fetch(`http://localhost:4000/api/users/phone/${normalizedPhone}`);
      const phoneData = await checkPhoneResponse.json();
      console.log("Response kiểm tra SĐT:", phoneData);

      let userId = null;
      if (checkPhoneResponse.ok && phoneData.exists) {
        userId = phoneData.userId; // Lấy ID của user nếu tồn tại
      }

      // Log dữ liệu cartItems để kiểm tra
      console.log("Cart Items trước khi tạo đơn hàng:", cartItems);

      const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
      if (!token) {
        throw new Error("Bạn cần đăng nhập để tạo đơn hàng");
      }

      // Lấy thông tin sản phẩm từ API
      const productIds = cartItems.map(item => item.id);
      const response = await fetch(`http://localhost:4000/api/products?ids=${productIds.join(",")}`);
      if (!response.ok) {
        throw new Error("Không thể lấy thông tin sản phẩm");
      }
      const products = await response.json();

      // Tạo map sản phẩm để truy cập nhanh
      const productMap = new Map(products.map(product => [product._id, product]));

      // Tính tổng giá trị đơn hàng và tạo danh sách items
      let totalPrice = 0;
      const orderItems = cartItems.map(item => {
        const product = productMap.get(item.id);
        if (!product) {
          throw new Error(`Không tìm thấy sản phẩm với ID ${item.id}`);
        }
        const itemPrice = (product.discountPrice || product.price) * item.quantity;
        totalPrice += itemPrice;

        return {
          product: product._id,
          quantity: item.quantity,
          price: product.discountPrice || product.price,
        };
      });

      // Tạo orderData
      const orderData = {
        items: orderItems,
        totalPrice: totalPrice,
        paymentMethod,
        paymentStatus: "pending",
        status: "pending",
        shippingMethod: {
          method: shippingMethod === "Express" ? "Vận chuyển nhanh" : 
                 shippingMethod === "SameDay" ? "Vận chuyển trong ngày" : 
                 "Vận chuyển thường",
          expectedDate: shippingMethod === "Express" ? "1-2 ngày" :
                       shippingMethod === "SameDay" ? "Trong ngày" :
                       "3-5 ngày",
          courier: shippingMethod === "Express" ? "Giao hàng nhanh" :
                  shippingMethod === "SameDay" ? "Giao hàng trong ngày" :
                  "Giao hàng tiêu chuẩn",
          trackingId: `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`
        },
        shippingAddress: {
          fullName: customer.name,
          phone: customer.phone,
          address: customer.address,
          city: customer.province?.name || "",
          district: customer.district?.name || "",
          ward: customer.ward?.name || "",
          postalCode: "700000"
        },
        phone: normalizedPhone
      };

      // Nếu có userId (SĐT trùng với user đã đăng ký), thêm vào orderData
      if (userId) {
        orderData.user = userId;
      }

      // Log orderData để kiểm tra
      console.log("Order Data gửi lên server:", JSON.stringify(orderData, null, 2));

      // Log để kiểm tra
      console.log("Cart Items:", cartItems);
      console.log("Tổng tiền:", orderData.totalPrice);

      // Hàm gửi request tạo đơn hàng
      const createOrder = async (token: string) => {
        // Log request data
        console.log("Request data:", {
          url: "http://localhost:4000/api/orders/admin",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: orderData
        });

        // Kiểm tra dữ liệu trước khi gửi
        if (!orderData.phone) {
          throw new Error("Số điện thoại không được cung cấp");
        }

        // Kiểm tra format số điện thoại
        if (!orderData.phone.match(/^0[0-9]{9}$/)) {
          throw new Error("Số điện thoại không đúng định dạng");
        }

        // Kiểm tra các trường bắt buộc
        if (!orderData.shippingAddress.fullName) {
          throw new Error("Tên người nhận không được cung cấp");
        }
        if (!orderData.shippingAddress.address) {
          throw new Error("Địa chỉ không được cung cấp");
        }
        if (!orderData.shippingAddress.city) {
          throw new Error("Thành phố không được cung cấp");
        }

        // Log dữ liệu trước khi gửi
        console.log("Dữ liệu gửi lên server:", JSON.stringify(orderData, null, 2));

        const response = await fetch("http://localhost:4000/api/orders/admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          const responseText = await response.text();
          console.error("Server response:", responseText);
          throw new Error(`Server response: ${responseText}`);
        }

        return response.json();
      };

      try {
        // Thử tạo đơn hàng với token hiện tại
        const data = await createOrder(token);
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
          router.push("/admin/orders/list"); // Chuyển hướng về trang danh sách đơn hàng
        });
      } catch (error: any) {
        // Nếu lỗi là do token hết hạn
        if (error.message.includes("AccessToken hết hạn")) {
          try {
            // Lấy refresh token
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
              throw new Error("Không tìm thấy refresh token");
            }

            // Gọi API refresh token
            const refreshResponse = await fetch("http://localhost:4000/api/auth/refresh-token", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refreshToken }),
            });

            if (!refreshResponse.ok) {
              throw new Error("Không thể refresh token");
            }

            const { accessToken } = await refreshResponse.json();
            
            // Lưu token mới
            localStorage.setItem("accessToken", accessToken);

            // Thử tạo đơn hàng lại với token mới
            const data = await createOrder(accessToken);
            console.log("Đơn hàng đã được tạo:", data);

            clearCart();
            resetCustomer();
            onResetForm?.();
            Swal.fire({
              title: "Thành công!",
              text: "Đơn hàng đã được tạo thành công!",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              router.push("/admin/orders/list");
            });
          } catch (refreshError) {
            // Nếu refresh token cũng lỗi, chuyển hướng về trang đăng nhập
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            router.push("/login");
            throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          }
        } else {
          throw error;
        }
      }
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
      <Button
        onClick={handleCreateOrder}
        disabled={isLoading}
        className={`px-6 py-2 bg-black text-white rounded-lg font-medium ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800 transition"
        }`}
      >
        {isLoading ? "Đang tạo..." : "Tạo Đơn Hàng"}
      </Button>
    </div>
  );
}