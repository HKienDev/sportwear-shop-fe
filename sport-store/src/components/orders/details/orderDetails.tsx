"use client";
import { useState, useEffect } from "react";
import { Clock, Package, Truck, Home } from "lucide-react";
import OrderHeader from "./orderHeader";
import DeliveryTracking from "./deliveryTracking";
import ShippingAddress from "./shippingAddress";
import ShippingMethod from "./shippingMethod";
import OrderTable from "./orderTable";
import { Order } from "@/types/order";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import CancelOrder from "./cancelOrder";

// Định nghĩa trạng thái đơn hàng
export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled"
}

// Mô tả chi tiết từng trạng thái
export const orderStatusInfo = {
  [OrderStatus.PENDING]: {
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: Clock,
    nextStatus: OrderStatus.PROCESSING,
    buttonText: "Xác Nhận Đơn Hàng",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    description: "Đơn hàng đang chờ xác nhận từ nhân viên bán hàng",
    date: "13/03/2025",
    time: "22:07"
  },
  [OrderStatus.PROCESSING]: {
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Package,
    nextStatus: OrderStatus.SHIPPED,
    buttonText: "Bắt Đầu Vận Chuyển",
    buttonColor: "bg-purple-500 hover:bg-purple-600",
    description: "Đơn hàng đã được xác nhận và đang chuẩn bị hàng",
    date: "13/03/2025",
    time: "22:08"
  },
  [OrderStatus.SHIPPED]: {
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: Truck,
    nextStatus: OrderStatus.DELIVERED,
    buttonText: "Xác Nhận Giao Hàng Thành Công",
    buttonColor: "bg-green-500 hover:bg-green-600",
    description: "Đơn hàng đang được vận chuyển đến địa chỉ khách hàng",
    date: "13/03/2025",
    time: "22:20"
  },
  [OrderStatus.DELIVERED]: {
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: Home,
    nextStatus: null,
    buttonText: "",
    buttonColor: "",
    description: "Đơn hàng đã được giao thành công đến khách hàng",
    date: "15/03/2025",
    time: "15:20"
  },
  [OrderStatus.CANCELLED]: {
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: Clock,
    nextStatus: null,
    buttonText: "",
    buttonColor: "",
    description: "Đơn hàng đã bị hủy",
    date: "15/03/2025",
    time: "15:20"
  }
};

interface OrderDetailsProps {
  orderId: string;
  status: Order["status"];
  items: Order["items"];
  shippingAddress: Order["shippingAddress"];
  shippingMethod: Order["shippingMethod"];
  shippingFee?: number;
  discount?: number;
  paymentMethod: Order["paymentMethod"];
  paymentStatus: Order["paymentStatus"];
  createdAt: string;
  user: string;
  onStatusUpdate?: (orderId: string, newStatus: Order["status"]) => void;
}

export default function OrderDetails({
  orderId,
  status,
  items,
  shippingAddress,
  shippingMethod,
  shippingFee = 0,
  discount = 0,
  paymentMethod,
  paymentStatus,
  createdAt,
  user,
  onStatusUpdate
}: OrderDetailsProps) {
  const [currentStatus, setCurrentStatus] = useState<Order["status"]>(status);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cập nhật currentStatus khi prop status thay đổi
  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  // Hàm để lấy lại thông tin đơn hàng mới nhất
  const refreshOrderDetails = async () => {
    try {
      setIsRefreshing(true);
      const { data: response } = await fetchWithAuth(`/orders/admin/${orderId}`);
      
      if (response.success && response.order) {
        setCurrentStatus(response.order.status);
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

  const handleUpdateStatus = async (newStatus: string) => {
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

      const { data: response } = await fetchWithAuth(`/orders/admin/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          status: newStatus,
          updatedBy: userData._id,
          note: `Cập nhật trạng thái từ ${currentStatus} sang ${newStatus}`
        }),
      });

      if (!response.success) {
        throw new Error(response.message || "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
      }

      // Cập nhật state local
      setCurrentStatus(newStatus as Order["status"]);
      
      // Gọi callback để cập nhật danh sách đơn hàng
      if (onStatusUpdate) {
        onStatusUpdate(orderId, newStatus as Order["status"]);
      }

      toast.success("Cập nhật trạng thái đơn hàng thành công");
      
      // Refresh lại thông tin đơn hàng
      await refreshOrderDetails();
    } catch (error) {
      console.error("Error updating order status:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng";
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

  const renderActionButton = () => {
    const isDisabled = isLoading || isRefreshing;
    
    switch (currentStatus) {
      case "pending":
        return (
          <Button
            onClick={() => handleUpdateStatus("processing")}
            disabled={isDisabled}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isDisabled ? "Đang xử lý..." : "Xác nhận đơn hàng"}
          </Button>
        );
      case "processing":
        return (
          <Button
            onClick={() => handleUpdateStatus("shipped")}
            disabled={isDisabled}
            className="bg-green-500 hover:bg-green-600"
          >
            {isDisabled ? "Đang xử lý..." : "Xác nhận đã giao cho đơn vị vận chuyển"}
          </Button>
        );
      case "shipped":
        return (
          <Button
            onClick={() => handleUpdateStatus("delivered")}
            disabled={isDisabled}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {isDisabled ? "Đang xử lý..." : "Xác nhận đã giao hàng"}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <OrderHeader
        orderId={orderId}
        customerId={user}
        lastUpdated={new Date(createdAt).toLocaleString("vi-VN")}
        status={currentStatus}
        paymentStatus={paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
      />
      <DeliveryTracking
        status={currentStatus}
        onChangeStatus={handleUpdateStatus}
        isLoading={isLoading || isRefreshing}
      />
      <div className="grid grid-cols-2 gap-6">
        <ShippingAddress
          name={shippingAddress.fullName}
          address={shippingAddress.address}
          phone={shippingAddress.phone}
          city={shippingAddress.city}
          district={shippingAddress.district}
          ward={shippingAddress.ward}
          postalCode={shippingAddress.postalCode}
        />
        <ShippingMethod
          method={paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Thanh toán online"}
          expectedDate="Dự kiến giao hàng: 15/03/2025 - 17/03/2025"
          courier="Viettel Post"
          trackingId={orderId}
          shippingMethod={shippingMethod?.method || "Vận chuyển thường"}
        />
      </div>
      <OrderTable
        items={items}
        shippingFee={shippingFee}
        discount={discount}
      />
      <div className="mt-8 flex gap-2">
        {renderActionButton()}
        {currentStatus !== "cancelled" && currentStatus !== "delivered" && (
          <CancelOrder 
            orderId={orderId}
            items={items}
            status={currentStatus}
            isDisabled={isRefreshing}
            onStatusUpdate={(id, newStatus) => {
              setCurrentStatus(newStatus as Order["status"]);
              if (onStatusUpdate) {
                onStatusUpdate(id, newStatus as Order["status"]);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}