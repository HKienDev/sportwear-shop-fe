"use client";
import { useState, useCallback, useEffect } from "react";
import { Clock, Package, Truck, Home } from "lucide-react";
import OrderHeader from "./orderHeader";
import DeliveryTracking from "./deliveryTracking";
import ShippingAddress from "./shippingAddress";
import ShippingMethod from "./shippingMethod";
import OrderTable from "./orderTable";
import { Order, OrderStatus } from "@/types/base";
import { AdminProduct } from "@/types/product";
import { toast } from "sonner";
import { safePromise } from "@/utils/promiseUtils";

type OrderItemProduct = AdminProduct;

// Mô tả chi tiết từng trạng thái
export const orderStatusInfo = {
  [OrderStatus.PENDING]: {
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: Clock,
    nextStatus: OrderStatus.CONFIRMED,
    buttonText: "Xác Nhận Đơn Hàng",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    description: "Đơn hàng đang chờ xác nhận từ nhân viên bán hàng",
    date: "13/03/2025",
    time: "22:07"
  },
  [OrderStatus.CONFIRMED]: {
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
} as const;

interface OrderDetailsProps {
  order: Order;
  orderId: string;
  onStatusUpdate?: (orderId: string, status: OrderStatus) => void;
}

export default function OrderDetails({ order, orderId, onStatusUpdate }: OrderDetailsProps) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  // Hàm để lấy lại thông tin đơn hàng mới nhất
  const refreshOrderDetails = useCallback(async () => {
    try {
      console.log('🔄 Refreshing order details:', orderId);
      
      const result = await safePromise(
        fetch(`/api/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
        }),
        'Không thể cập nhật thông tin đơn hàng'
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Không thể cập nhật thông tin đơn hàng');
      }
      
      const response = await result.data!.json();
      console.log('📥 Refresh response:', response);
      
      if (response.success && response.data?.status) {
        setCurrentStatus(response.data.status);
        console.log('✅ Status updated:', response.data.status);
      }
    } catch (error) {
      console.error("❌ Error refreshing order details:", error);
      toast.error("Không thể cập nhật thông tin đơn hàng");
    }
  }, [orderId]);

  useEffect(() => {
    refreshOrderDetails();
  }, [refreshOrderDetails]);

  // Hàm xử lý cập nhật trạng thái đơn hàng
  const handleUpdateStatus = (newStatus: OrderStatus) => {
    const updateStatus = async () => {
      try {
        setIsUpdating(true);
        console.log('🔄 Updating order status:', orderId, 'to', newStatus);
        
        const result = await safePromise(
          fetch(`/api/orders/${orderId}/status`, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
            credentials: 'include',
          }),
          'Không thể cập nhật trạng thái đơn hàng'
        );
        
        if (!result.success) {
          throw new Error(result.error || 'Không thể cập nhật trạng thái đơn hàng');
        }
        
        const response = await result.data!.json();
        console.log('📥 Update status response:', response);

        if (response.success) {
          setCurrentStatus(newStatus);
          toast.success("Cập nhật trạng thái đơn hàng thành công");
          if (onStatusUpdate) {
            onStatusUpdate(orderId, newStatus);
          }
        } else {
          toast.error("Không thể cập nhật trạng thái đơn hàng");
        }
      } catch (error) {
        console.error("❌ Error updating order status:", error);
        toast.error("Không thể cập nhật trạng thái đơn hàng");
      } finally {
        setIsUpdating(false);
      }
    };

    updateStatus();
  };

  // Hàm xử lý hủy đơn hàng
  const handleCancelOrderStatusUpdate = (id: string, newStatus: OrderStatus) => {
    const updateStatus = async () => {
      try {
        setIsUpdating(true);
        console.log('🔄 Canceling order:', id, 'to', newStatus);
        
        const result = await safePromise(
          fetch(`/api/orders/${id}/status`, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ 
              status: newStatus,
              note: "Đơn hàng đã bị hủy bởi admin"
            }),
            credentials: 'include',
          }),
          'Không thể hủy đơn hàng'
        );
        
        if (!result.success) {
          throw new Error(result.error || 'Không thể hủy đơn hàng');
        }
        
        const response = await result.data!.json();
        console.log('📥 Cancel order response:', response);

        if (response.success) {
          setCurrentStatus(newStatus);
          toast.success("Hủy đơn hàng thành công");
          if (onStatusUpdate) {
            onStatusUpdate(id, newStatus);
          }
        } else {
          toast.error("Không thể hủy đơn hàng");
        }
      } catch (error) {
        console.error("❌ Error canceling order:", error);
        toast.error("Không thể hủy đơn hàng");
      } finally {
        setIsUpdating(false);
      }
    };

    updateStatus();
  };

  return (
    <div className="space-y-6">
      <OrderHeader
        shortId={order.shortId}
        customerId={order.user?.customId || "Không có dữ liệu"}
        lastUpdated={new Date(order.updatedAt).toLocaleString("vi-VN")}
        status={currentStatus}
        paymentStatus={currentStatus === OrderStatus.DELIVERED ? "Đã thanh toán" : (order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán")}
      />
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="w-full">
          <DeliveryTracking 
            status={currentStatus}
            onChangeStatus={handleUpdateStatus}
            isLoading={isUpdating}
            orderId={orderId}
            items={order.items.map(item => ({
              product: {
                _id: typeof item.product === 'string' ? item.product : item.product._id,
                name: typeof item.product === 'string' ? '' : item.product.name,
                price: item.price,
                images: {
                  main: typeof item.product === 'string' ? '' : item.product.mainImage || '',
                  sub: typeof item.product === 'string' ? [] : item.product.subImages || []
                }
              },
              quantity: item.quantity,
              price: item.price
            }))}
            onCancelOrder={handleCancelOrderStatusUpdate}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ShippingMethod 
            method={order.shippingMethod?.name || "Standard"}
            shortId={order.shortId}
            shippingMethod="standard"
            createdAt={order.createdAt ? new Date(order.createdAt).toISOString() : undefined}
          />
          <ShippingAddress 
            name={order.shippingAddress.fullName || "Không có dữ liệu"}
            address={`${order.shippingAddress.address.street || ""}, ${order.shippingAddress.address.ward.name}, ${order.shippingAddress.address.district.name}, ${order.shippingAddress.address.province.name}`}
            phone={order.shippingAddress.phone || "Không có dữ liệu"}
          />
        </div>
        <OrderTable 
          items={order.items.map(item => {
            const productData: OrderItemProduct = typeof item.product === 'string' ? {
              _id: item.product,
              name: '',
              description: '',
              originalPrice: item.price,
              salePrice: item.price,
              mainImage: '',
              subImages: [],
              categoryId: '',
              stock: 0,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              brand: '',
              sku: '',
              colors: [],
              sizes: [],
              tags: [],
              ratings: { average: 0, count: 0 },
              soldCount: 0,
              viewCount: 0,
              discountPercentage: 0,
              isOutOfStock: false,
              isLowStock: false
            } : {
              _id: item.product._id,
              name: item.product.name,
              description: item.product.description || '',
              originalPrice: item.price,
              salePrice: item.price,
              mainImage: item.product.mainImage || '',
              subImages: item.product.subImages || [],
              categoryId: item.product.categoryId || '',
              stock: item.product.stock || 0,
              isActive: item.product.isActive || true,
              createdAt: item.product.createdAt || new Date().toISOString(),
              updatedAt: item.product.updatedAt || new Date().toISOString(),
              brand: item.product.brand || '',
              sku: item.product.sku || '',
              colors: item.product.colors || [],
              sizes: item.product.sizes || [],
              tags: item.product.tags || [],
              ratings: item.product.ratings || { average: 0, count: 0 },
              soldCount: item.product.soldCount || 0,
              viewCount: item.product.viewCount || 0,
              discountPercentage: item.product.discountPercentage || 0,
              isOutOfStock: item.product.isOutOfStock || false,
              isLowStock: item.product.isLowStock || false
            };
            return {
              product: productData,
              quantity: item.quantity,
              price: item.price,
              size: item.size,
              color: item.color
            };
          })}
          shippingMethod={order.shippingMethod}
          discount={order.directDiscount || 0}
          couponDiscount={order.couponDiscount || 0}
          couponCode={order.couponCode || ""}
          totalPrice={order.totalPrice}
          subtotal={order.subtotal}
          shipping={order.shippingFee || order.shippingMethod?.fee || 0}
          appliedCoupon={order.appliedCoupon}
        />
      </div>
    </div>
  );
}