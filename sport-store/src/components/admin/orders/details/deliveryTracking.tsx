"use client";

import { useState, useEffect } from "react";
import { Clock, Package, Truck, Home, Loader2 } from "lucide-react";
import { OrderStatus } from "@/types/base";
import CancelOrder from "./cancelOrder";

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

interface DeliveryTrackingProps {
  status: OrderStatus;
  onChangeStatus: (status: OrderStatus) => void;
  isLoading: boolean;
  orderId?: string;
  items?: OrderItem[];
  onCancelOrder?: (orderId: string, status: OrderStatus) => void;
}

export default function DeliveryTracking({
  status,
  onChangeStatus,
  isLoading,
  orderId,
  items,
  onCancelOrder,
}: DeliveryTrackingProps) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(status);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsAnimating(true);
    setCurrentStatus(newStatus);
    await onChangeStatus(newStatus);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case OrderStatus.PENDING:
        return OrderStatus.CONFIRMED;
      case OrderStatus.CONFIRMED:
        return OrderStatus.SHIPPED;
      case OrderStatus.SHIPPED:
        return OrderStatus.DELIVERED;
      case OrderStatus.DELIVERED:
      case OrderStatus.CANCELLED:
        return null;
      default:
        return OrderStatus.CONFIRMED;
    }
  };

  const nextStatus = getNextStatus(currentStatus);

  return (
    <div className="px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-700 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Theo Dõi Đơn Hàng
        </h3>
        
        <div className="flex items-center gap-4">
          {nextStatus && currentStatus !== OrderStatus.CANCELLED && (
            <button
              onClick={() => handleStatusChange(nextStatus)}
              disabled={isLoading}
              className={`
                inline-flex items-center justify-center gap-2
                px-6 py-2.5 rounded-lg font-medium text-sm
                transition-all duration-200 ease-in-out
                ${isAnimating ? 'animate-pulse' : ''}
                ${currentStatus === OrderStatus.PENDING ? 'bg-blue-600 hover:bg-blue-700 text-white' : 
                  currentStatus === OrderStatus.CONFIRMED ? 'bg-purple-600 hover:bg-purple-700 text-white' :
                  currentStatus === OrderStatus.SHIPPED ? 'bg-green-600 hover:bg-green-700 text-white' : 
                  'bg-gray-600 hover:bg-gray-700 text-white'}
                shadow-sm hover:shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed
                transform hover:-translate-y-0.5
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang cập nhật...</span>
                </>
              ) : (
                <>
                  {currentStatus === OrderStatus.PENDING && (
                    <>
                      <Package className="w-4 h-4" />
                      <span>Xác nhận đơn hàng</span>
                    </>
                  )}
                  {currentStatus === OrderStatus.CONFIRMED && (
                    <>
                      <Truck className="w-4 h-4" />
                      <span>Bắt đầu vận chuyển</span>
                    </>
                  )}
                  {currentStatus === OrderStatus.SHIPPED && (
                    <>
                      <Home className="w-4 h-4" />
                      <span>Xác nhận đã giao</span>
                    </>
                  )}
                </>
              )}
            </button>
          )}
          
          {orderId && items && onCancelOrder && currentStatus !== OrderStatus.CANCELLED && currentStatus !== OrderStatus.DELIVERED && (
            <CancelOrder
              orderId={orderId}
              items={items}
              status={currentStatus}
              onStatusUpdate={onCancelOrder}
            />
          )}
        </div>
      </div>

      {currentStatus === OrderStatus.CANCELLED ? (
        <div className="p-4 bg-red-50 rounded-xl flex items-start gap-3">
          <div className="bg-red-100 p-2 rounded-full">
            <Clock className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-medium text-red-500">Đơn hàng đã bị hủy</h3>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full max-w-3xl mx-auto">
          {/* Pending */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStatus === OrderStatus.PENDING || currentStatus === OrderStatus.CONFIRMED || currentStatus === OrderStatus.SHIPPED || currentStatus === OrderStatus.DELIVERED ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
              <Clock size={20} />
            </div>
            <div className="text-xs font-medium mt-2 text-center">Chờ xác nhận</div>
          </div>
          
          {/* Pending connector */}
          <div className={`h-1 flex-1 mx-1 transition-all duration-700 ease-in-out ${currentStatus === OrderStatus.CONFIRMED || currentStatus === OrderStatus.SHIPPED || currentStatus === OrderStatus.DELIVERED ? 'bg-green-500' : 'bg-gray-200'} ${isAnimating ? 'animate-pulse' : ''}`}></div>
          
          {/* Confirmed */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 ease-in-out ${currentStatus === OrderStatus.CONFIRMED || currentStatus === OrderStatus.SHIPPED || currentStatus === OrderStatus.DELIVERED ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'} ${isAnimating && (currentStatus === OrderStatus.CONFIRMED || currentStatus === OrderStatus.SHIPPED || currentStatus === OrderStatus.DELIVERED) ? 'animate-bounce' : ''}`}>
              <Package size={20} />
            </div>
            <div className="text-xs font-medium mt-2 text-center">Đã xác nhận</div>
          </div>
          
          {/* Shipping connector */}
          <div className={`h-1 flex-1 mx-1 transition-all duration-700 ease-in-out ${currentStatus === OrderStatus.SHIPPED || currentStatus === OrderStatus.DELIVERED ? 'bg-green-500' : 'bg-gray-200'} ${isAnimating ? 'animate-pulse' : ''}`}></div>
          
          {/* Shipping */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 ease-in-out ${currentStatus === OrderStatus.SHIPPED || currentStatus === OrderStatus.DELIVERED ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'} ${isAnimating && (currentStatus === OrderStatus.SHIPPED || currentStatus === OrderStatus.DELIVERED) ? 'animate-bounce' : ''}`}>
              <Truck size={20} />
            </div>
            <div className="text-xs font-medium mt-2 text-center">Đang vận chuyển</div>
          </div>
          
          {/* Delivered connector */}
          <div className={`h-1 flex-1 mx-1 transition-all duration-700 ease-in-out ${currentStatus === OrderStatus.DELIVERED ? 'bg-green-500' : 'bg-gray-200'} ${isAnimating ? 'animate-pulse' : ''}`}></div>
          
          {/* Delivered */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 ease-in-out ${currentStatus === OrderStatus.DELIVERED ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'} ${isAnimating && currentStatus === OrderStatus.DELIVERED ? 'animate-bounce' : ''}`}>
              <Home size={20} />
            </div>
            <div className="text-xs font-medium mt-2 text-center">Đã giao hàng</div>
          </div>
        </div>
      )}
    </div>
  );
}