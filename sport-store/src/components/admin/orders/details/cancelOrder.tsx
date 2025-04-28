"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
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
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Order, OrderStatus } from "@/types/order";

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
  status: Order["status"];
  isDisabled?: boolean;
  onStatusUpdate?: (orderId: string, newStatus: Order["status"]) => void;
}

export default function CancelOrder({ orderId, items, status, isDisabled, onStatusUpdate }: CancelOrderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Hàm để lấy lại thông tin đơn hàng mới nhất
  const refreshOrderDetails = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetchWithAuth<{ status: Order["status"] }>(`/orders/${orderId}`);
      
      if (response.success && response.data?.status) {
        if (onStatusUpdate) {
          onStatusUpdate(orderId, response.data.status);
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

      // Kiểm tra trạng thái hiện tại của đơn hàng
      const currentOrderResponse = await fetchWithAuth<{ status: Order["status"] }>(`/orders/${orderId}`);
      
      if (currentOrderResponse.success && currentOrderResponse.data?.status === OrderStatus.CANCELLED) {
        toast("Đơn hàng đã được hủy trước đó");
        setIsOpen(false);
        return;
      }

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
        status: OrderStatus.CANCELLED,
        updatedBy: userData._id,
        reason: "Hủy bởi admin",
        restoreStock: true // Thêm flag để server biết cần hoàn lại stock
      };

      const response = await fetchWithAuth<{ status: Order["status"] }>(`/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cancelData)
      });

      if (!response.success || !response.data?.status) {
        throw new Error(response.message || "Không thể hủy đơn hàng");
      }

      toast.success("Hủy đơn hàng thành công và đã hoàn lại số lượng sản phẩm vào kho");
      
      // Cập nhật trạng thái đơn hàng
      if (onStatusUpdate) {
        onStatusUpdate(orderId, OrderStatus.CANCELLED);
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
  if (status === OrderStatus.CANCELLED || status === OrderStatus.DELIVERED) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={isDisabled || isLoading || isRefreshing}
          className="w-full"
        >
          {isLoading ? "Đang hủy..." : "Hủy đơn hàng"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này sẽ:
          </AlertDialogDescription>
          <div className="mt-2">
            <ul className="list-disc list-inside space-y-1">
              <li>Hoàn lại số lượng sản phẩm vào kho</li>
              <li>Không thể hoàn tác sau khi hủy</li>
            </ul>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancelOrder} className="bg-red-600 hover:bg-red-700">
            Xác nhận hủy
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 