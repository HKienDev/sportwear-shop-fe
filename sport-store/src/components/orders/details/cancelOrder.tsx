"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface CancelOrderProps {
  orderId: string;
  status: string;
  items: Array<{
    product: string;
    quantity: number;
  }>;
}

export default function CancelOrder({ orderId, status, items }: CancelOrderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCancelOrder = async () => {
    try {
      // Chỉ cho phép hủy đơn từ trạng thái "Đã xác nhận" trở đi
      if (status === "pending") {
        Swal.fire({
          title: "Không thể hủy đơn!",
          text: "Chỉ có thể hủy đơn từ trạng thái 'Đã xác nhận' trở đi.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }

      // Hiển thị xác nhận trước khi hủy
      const result = await Swal.fire({
        title: "Xác nhận hủy đơn?",
        text: "Bạn có chắc chắn muốn hủy đơn hàng này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Có, hủy đơn!",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        setIsLoading(true);

        console.log("Đang gửi request hủy đơn...");
        console.log("Order ID:", orderId);
        console.log("Status:", status);
        console.log("Token:", localStorage.getItem("accessToken"));

        // Gọi API hủy đơn
        const response = await fetch(`http://localhost:4000/api/orders/admin/${orderId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);

        if (!response.ok) {
          // Xử lý các trường hợp lỗi cụ thể
          if (response.status === 404) {
            throw new Error("Đơn hàng không tồn tại");
          } else if (response.status === 403) {
            throw new Error("Bạn không có quyền hủy đơn hàng này");
          } else if (response.status === 400) {
            throw new Error(data.message || "Không thể hủy đơn hàng ở trạng thái này");
          } else if (response.status === 500) {
            // Hiển thị thông báo lỗi chi tiết từ server
            console.error("Lỗi server:", data.error);
            throw new Error(data.message || data.error || "Lỗi server khi hủy đơn hàng. Vui lòng thử lại sau.");
          } else {
            throw new Error(data.message || data.error || "Không thể hủy đơn hàng. Vui lòng thử lại sau.");
          }
        }

        // Hiển thị thông báo thành công
        Swal.fire({
          title: "Thành công!",
          text: "Đơn hàng đã được hủy thành công!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/admin/orders/list"); // Chuyển hướng về trang danh sách đơn hàng
        });
      }
    } catch (error) {
      console.error("Lỗi chi tiết khi hủy đơn hàng:", error);
      Swal.fire({
        title: "Lỗi!",
        text: error instanceof Error ? error.message : "Đã có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại sau.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCancelOrder}
      disabled={isLoading || status === "pending"}
      className={`px-6 py-2 bg-red-600 text-white rounded-lg font-medium ${
        isLoading || status === "pending"
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-red-700 transition"
      }`}
    >
      {isLoading ? "Đang xử lý..." : "Hủy Đơn Hàng"}
    </Button>
  );
} 