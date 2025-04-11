"use client";
import { useState, useCallback, useEffect } from "react";
import { Clock, Package, Truck, Home } from "lucide-react";
import OrderHeader from "./orderHeader";
import DeliveryTracking from "./deliveryTracking";
import ShippingAddress from "./shippingAddress";
import ShippingMethod from "./shippingMethod";
import OrderTable from "./orderTable";
import { Order } from "@/types/order";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import toast from "react-hot-toast";
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
  sku: string;
  color?: string;
  size?: string;
}

interface OrderTableItem {
  product: { 
    _id: string; 
    name: string; 
    price: number;
    images: {
      main: string;
      sub: string[];
    };
    shortId: string;
  };
  quantity: number;
  price: number;
  sku: string;
  color?: string;
  size?: string;
}

interface OrderDetailsProps {
  order: Order;
  orderId: string;
  onStatusUpdate?: (orderId: string, status: Order["status"]) => void;
}

export default function OrderDetails({ order, orderId, onStatusUpdate }: OrderDetailsProps) {
  const [currentStatus, setCurrentStatus] = useState<Order["status"]>(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  // Hàm để lấy lại thông tin đơn hàng mới nhất
  const refreshOrderDetails = useCallback(async () => {
    try {
      const response = await fetchWithAuth<{ status: Order["status"] }>(`/api/orders/admin/${orderId}`);
      
      if (response.success && response.data?.status) {
        setCurrentStatus(response.data.status);
      }
    } catch (error) {
      console.error("Error refreshing order details:", error);
      toast.error("Không thể cập nhật thông tin đơn hàng");
    }
  }, [orderId]);

  useEffect(() => {
    refreshOrderDetails();
  }, [refreshOrderDetails]);

  // Hàm xử lý cập nhật trạng thái đơn hàng
  const handleUpdateStatus = (newStatus: Order["status"]) => {
    const updateStatus = async () => {
      try {
        setIsUpdating(true);
        const response = await fetchWithAuth<{ status: Order["status"] }>(`/api/orders/admin/${orderId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            status: newStatus,
            updatedBy: order.user
          }),
        });

        if (!response.success) {
          throw new Error(response.message || "Không thể cập nhật trạng thái đơn hàng");
        }

        setCurrentStatus(newStatus);
        toast.success("Cập nhật trạng thái đơn hàng thành công");
        onStatusUpdate?.(orderId, newStatus);
      } catch (error) {
        console.error("Lỗi cập nhật trạng thái:", error);
        toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật trạng thái");
      } finally {
        setIsUpdating(false);
      }
    };

    updateStatus();
  };

  // Hàm xử lý cập nhật trạng thái từ component CancelOrder
  const handleCancelOrderStatusUpdate = (id: string, newStatus: string) => {
    const updateStatus = async () => {
      try {
        setIsUpdating(true);
        const response = await fetchWithAuth<{ status: Order["status"] }>(`/api/orders/admin/${id}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            status: newStatus,
            updatedBy: order.user
          }),
        });

        if (!response.success) {
          throw new Error(response.message || "Không thể cập nhật trạng thái đơn hàng");
        }

        setCurrentStatus(newStatus as Order["status"]);
        toast.success("Cập nhật trạng thái đơn hàng thành công");
        onStatusUpdate?.(id, newStatus as Order["status"]);
      } catch (error) {
        console.error("Lỗi cập nhật trạng thái:", error);
        toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật trạng thái");
      } finally {
        setIsUpdating(false);
      }
    };

    updateStatus();
  };

  // Chuyển đổi items từ Order sang OrderTableItem cho OrderTable
  const orderTableItems: OrderTableItem[] = order.items.map((item) => ({
    product: {
      _id: typeof item.product === 'string' ? item.product : item.product._id,
      name: typeof item.product === 'string' ? '' : item.product.name,
      price: typeof item.product === 'string' ? 0 : item.product.price,
      images: {
        main: typeof item.product === 'string' ? '' : (item.product.images?.[0] || ""),
        sub: typeof item.product === 'string' ? [] : (item.product.images?.slice(1) || [])
      },
      shortId: typeof item.product === 'string' ? item.product.slice(-6) : item.product._id.slice(-6)
    },
    quantity: item.quantity,
    price: item.price,
    sku: item.sku,
    color: item.color,
    size: item.size
  }));

  // Chuyển đổi items từ Order sang OrderItem cho CancelOrder
  const cancelOrderItems: OrderItem[] = order.items.map(item => ({
    product: {
      _id: typeof item.product === 'string' ? item.product : item.product._id,
      name: typeof item.product === 'string' ? '' : item.product.name,
      price: typeof item.product === 'string' ? 0 : item.product.price,
      images: {
        main: typeof item.product === 'string' ? '' : (item.product.images?.[0] || ""),
        sub: typeof item.product === 'string' ? [] : (item.product.images?.slice(1) || [])
      }
    },
    quantity: item.quantity,
    price: item.price,
    sku: item.sku,
    color: item.color,
    size: item.size
  }));

  // Render nút hành động dựa trên trạng thái hiện tại
  const renderActionButton = () => {
    const isDisabled = isUpdating;
    
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

  return (
    <div className="space-y-6">
      <OrderHeader
        orderId={orderId}
        customerId={order.user._id || "Không có dữ liệu"}
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
        isLoading={isUpdating}
      />
      <div className="grid grid-cols-2 gap-6">
        <ShippingAddress
          name={order.shippingAddress?.fullName || "Không có dữ liệu"}
          address={order.shippingAddress?.address || "Không có dữ liệu"}
          phone={order.shippingAddress?.phone || "Không có dữ liệu"}
          city={order.shippingAddress?.city || "Không có dữ liệu"}
          district={order.shippingAddress?.district || "Không có dữ liệu"}
          ward={order.shippingAddress?.ward || "Không có dữ liệu"}
        />
        <ShippingMethod
          method={order.paymentMethod === "cash" ? "Thanh toán khi nhận hàng" : "Thanh toán online"}
          expectedDate="Dự kiến giao hàng: 15/03/2025 - 17/03/2025"
          courier="Viettel Post"
          trackingId={orderId}
        />
      </div>
      <OrderTable
        items={orderTableItems}
        shippingMethod={{
          name: "Standard",
          fee: 30000
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
          items={cancelOrderItems}
          onStatusUpdate={handleCancelOrderStatusUpdate}
          isDisabled={isUpdating}
        />
      </div>
    </div>
  );
}