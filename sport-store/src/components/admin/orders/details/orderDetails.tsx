"use client";
import { useState } from "react";
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
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

// Mô tả chi tiết từng trạng thái
export const orderStatusInfo = {
  pending: {
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: Clock,
    nextStatus: "processing" as OrderStatus,
    buttonText: "Xác Nhận Đơn Hàng",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    description: "Đơn hàng đang chờ xác nhận từ nhân viên bán hàng",
    date: "13/03/2025",
    time: "22:07"
  },
  processing: {
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Package,
    nextStatus: "shipped" as OrderStatus,
    buttonText: "Bắt Đầu Vận Chuyển",
    buttonColor: "bg-purple-500 hover:bg-purple-600",
    description: "Đơn hàng đã được xác nhận và đang chuẩn bị hàng",
    date: "13/03/2025",
    time: "22:08"
  },
  shipped: {
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: Truck,
    nextStatus: "delivered" as OrderStatus,
    buttonText: "Xác Nhận Giao Hàng Thành Công",
    buttonColor: "bg-green-500 hover:bg-green-600",
    description: "Đơn hàng đang được vận chuyển đến địa chỉ khách hàng",
    date: "13/03/2025",
    time: "22:20"
  },
  delivered: {
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
  cancelled: {
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
} as const;

interface OrderDetailsProps {
  order: Order;
  orderId: string;
  onStatusUpdate?: (orderId: string, status: Order["status"]) => void;
}

export default function OrderDetails({ order, orderId, onStatusUpdate }: OrderDetailsProps) {
  const [currentStatus, setCurrentStatus] = useState<Order["status"]>(order.status);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

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

  // Hàm xử lý cập nhật trạng thái đơn hàng
  const handleUpdateStatus = (newStatus: Order["status"]) => {
    const updateStatus = async () => {
      try {
        setIsLoading(true);
        
        // Kiểm tra orderId có hợp lệ không
        if (!orderId) {
          throw new Error("ID đơn hàng không được để trống!");
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
          localStorage.removeItem("user");
          return;
        }

        console.log("🔄 Đang cập nhật trạng thái đơn hàng:", {
          orderId,
          currentStatus,
          newStatus,
          userData: userData._id
        });

        const requestBody = { 
          status: newStatus,
          updatedBy: userData._id,
          note: `Cập nhật trạng thái từ ${currentStatus} sang ${newStatus}`
        };
        console.log("📤 Request body:", requestBody);

        const response = await fetchWithAuth(`/orders/admin/${orderId}/status`, {
          method: "PUT",
          body: JSON.stringify(requestBody),
        });

        console.log("📥 Response từ server:", response);

        if (!response.ok) {
          console.error("❌ Lỗi khi cập nhật trạng thái:", response);
          throw new Error(response.data.message || "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
        }

        // Cập nhật trạng thái local
        setCurrentStatus(newStatus);
        if (onStatusUpdate) {
          onStatusUpdate(orderId, newStatus);
        }

        // Hiển thị thông báo thành công
        toast.success("Cập nhật trạng thái đơn hàng thành công!");

        // Làm mới thông tin đơn hàng
        await refreshOrderDetails();
      } catch (error) {
        console.error("Error updating order status:", error);
        toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
      } finally {
        setIsLoading(false);
      }
    };

    updateStatus();
  };

  // Render nút hành động dựa trên trạng thái hiện tại
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
            className="bg-purple-500 hover:bg-purple-600"
          >
            {isDisabled ? "Đang xử lý..." : "Bắt đầu vận chuyển"}
          </Button>
        );
      case "shipped":
        return (
          <Button
            onClick={() => handleUpdateStatus("delivered")}
            disabled={isDisabled}
            className="bg-green-500 hover:bg-green-600"
          >
            {isDisabled ? "Đang xử lý..." : "Xác nhận đã giao hàng"}
          </Button>
        );
      default:
        return null;
    }
  };

  // Hàm xử lý cập nhật trạng thái từ component CancelOrder
  const handleCancelOrderStatusUpdate = (id: string, newStatus: string) => {
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;
    
    if (validStatuses.includes(newStatus as Order["status"])) {
      const status = newStatus as Order["status"];
      setCurrentStatus(status);
      if (onStatusUpdate) {
        onStatusUpdate(id, status);
      }
    } else {
      console.error("Invalid status:", newStatus);
    }
  };

  return (
    <div className="space-y-6">
      <OrderHeader
        orderId={orderId}
        customerId={order.user || "Không có dữ liệu"}
        lastUpdated={new Date(order.createdAt).toLocaleString("vi-VN")}
        status={currentStatus}
        paymentStatus={order.status === "delivered" ? "Đã thanh toán" : "Chưa thanh toán"}
      />
      <DeliveryTracking
        status={currentStatus}
        onChangeStatus={(status: string) => {
          if (status === "pending" || status === "processing" || status === "shipped" || status === "delivered" || status === "cancelled") {
            handleUpdateStatus(status as Order["status"]);
          }
        }}
        isLoading={isLoading || isRefreshing}
      />
      <div className="grid grid-cols-2 gap-6">
        <ShippingAddress
          name={order.shippingAddress?.fullName || "Không có dữ liệu"}
          address={order.shippingAddress?.address || "Không có dữ liệu"}
          phone={order.shippingAddress?.phone || "Không có dữ liệu"}
          city={order.shippingAddress?.city || "Không có dữ liệu"}
          district={order.shippingAddress?.district || "Không có dữ liệu"}
          ward={order.shippingAddress?.ward || "Không có dữ liệu"}
          postalCode={order.shippingAddress?.postalCode || "Không có dữ liệu"}
        />
        <ShippingMethod
          method={order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Thanh toán online"}
          expectedDate="Dự kiến giao hàng: 15/03/2025 - 17/03/2025"
          courier="Viettel Post"
          trackingId={orderId}
          shippingMethod={order.shippingMethod.method === "standard" ? "Vận chuyển thường" : "Vận chuyển nhanh"}
        />
      </div>
      <OrderTable
        items={order.items.map(item => ({
          product: {
            _id: item.product._id,
            name: item.product.name,
            price: item.price,
            images: item.product.images,
            shortId: item.product._id.slice(-6)
          },
          quantity: item.quantity,
          price: item.price
        }))}
        shippingMethod={{
          name: order.shippingMethod.method,
          fee: order.shippingMethod.method === "Standard" 
            ? 30000 
            : order.shippingMethod.method === "Express" 
              ? 50000 
              : 100000 // SameDay
        }}
        discount={0}
      />
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          {renderActionButton()}
        </div>
        <CancelOrder
          orderId={orderId}
          status={currentStatus}
          items={order.items.map(item => ({
            product: {
              _id: item.product._id,
              name: item.product.name,
              price: item.price,
              images: item.product.images
            },
            quantity: item.quantity,
            price: item.price
          }))}
          onStatusUpdate={handleCancelOrderStatusUpdate}
          isDisabled={isLoading || isRefreshing}
        />
      </div>
    </div>
  );
}