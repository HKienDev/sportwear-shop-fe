"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { Loader2, X, AlertTriangle, Package } from "lucide-react";

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
          productId: item.product?._id || 'unknown',
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
        <button
          disabled={isDisabled || isLoading || isRefreshing}
          className={`
            inline-flex items-center justify-center gap-2
            px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium text-sm sm:text-base
            transition-all duration-300 ease-in-out
            bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white
            shadow-lg hover:shadow-xl
            disabled:opacity-50 disabled:cursor-not-allowed
            transform hover:-translate-y-0.5 active:translate-y-0
            ${isLoading ? 'animate-pulse' : ''}
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang hủy...</span>
            </>
          ) : (
            <>
              <X className="w-4 h-4" />
              <span>Hủy đơn hàng</span>
            </>
          )}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md mx-4">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg font-semibold text-slate-800">
                Xác nhận hủy đơn hàng
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-slate-600 mt-1">
                Hành động này không thể hoàn tác
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-amber-800 mb-2">Hậu quả khi hủy đơn hàng:</h4>
                <ul className="space-y-2 text-sm text-amber-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    Hoàn lại số lượng sản phẩm vào kho
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    Không thể hoàn tác sau khi hủy
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    Thông báo hủy đơn cho khách hàng
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300">
            Không hủy
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleCancelOrder} 
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0"
          >
            <X className="w-4 h-4 mr-2" />
            Xác nhận hủy
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 