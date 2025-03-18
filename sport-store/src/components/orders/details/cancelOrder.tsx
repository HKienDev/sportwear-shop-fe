"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: {
      main: string;
      sub: string[];
    };
  };
  quantity: number;
  price: number;
}

interface CancelOrderProps {
  orderId: string;
  items: OrderItem[];
  status: string;
  isDisabled?: boolean;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
}

export default function CancelOrder({ orderId, items, status, isDisabled, onStatusUpdate }: CancelOrderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Hàm để lấy lại thông tin đơn hàng mới nhất
  const refreshOrderDetails = async () => {
    try {
      setIsRefreshing(true);
      const { data: response } = await fetchWithAuth(`/orders/admin/${orderId}`);
      
      if (response.success && response.order) {
        if (onStatusUpdate) {
          onStatusUpdate(orderId, response.order.status);
        }
      }
    } catch (error) {
      console.error("Error refreshing order details:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setIsLoading(true);

      // Lấy thông tin user từ localStorage
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        toast.error("Vui lòng đăng nhập lại");
        return;
      }

      let userData;
      try {
        userData = JSON.parse(userStr);
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast.error("Lỗi khi đọc thông tin người dùng");
        return;
      }

      if (!userData || !userData._id) {
        toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại");
        // Xóa thông tin user không hợp lệ
        localStorage.removeItem("user");
        return;
      }

      // Chuẩn bị dữ liệu để gửi lên server
      const cancelData = {
        items: items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity
        })),
        status: "cancelled",
        updatedBy: userData._id,
        reason: "Hủy bởi admin",
        restoreStock: true // Thêm flag để server biết cần hoàn lại stock
      };

      const { data: response } = await fetchWithAuth(`/orders/admin/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cancelData)
      });

      if (!response.success) {
        throw new Error(response.message || "Không thể hủy đơn hàng");
      }

      toast.success("Hủy đơn hàng thành công và đã hoàn lại số lượng sản phẩm vào kho");
      
      // Cập nhật trạng thái đơn hàng
      if (onStatusUpdate) {
        onStatusUpdate(orderId, "cancelled");
      }

      // Đóng dialog
      setIsOpen(false);
      
      // Refresh lại thông tin đơn hàng
      await refreshOrderDetails();
    } catch (error) {
      console.error("Error canceling order:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi hủy đơn hàng";
      toast.error(errorMessage);
      
      // Nếu lỗi liên quan đến authentication
      if (errorMessage.includes("authentication") || errorMessage.includes("unauthorized")) {
        localStorage.removeItem("user");
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Kiểm tra xem đơn hàng có thể hủy không
  if (status === "cancelled" || status === "delivered") {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          disabled={isLoading || isRefreshing}
          className="bg-red-500 hover:bg-red-600"
        >
          {isLoading ? "Đang xử lý..." : "Hủy đơn hàng"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể
            hoàn tác và số lượng sản phẩm sẽ được hoàn lại vào kho.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Không</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleCancelOrder}
            className="bg-red-500 hover:bg-red-600"
            disabled={isLoading || isRefreshing}
          >
            {isLoading ? "Đang xử lý..." : "Có, hủy đơn hàng"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 