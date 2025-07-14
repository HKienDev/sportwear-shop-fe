"use client";

import { useState, useEffect } from "react";
import { Clock, Package, Truck, Home, Loader2, CheckCircle } from "lucide-react";
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

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 1;
      case OrderStatus.CONFIRMED: return 2;
      case OrderStatus.SHIPPED: return 3;
      case OrderStatus.DELIVERED: return 4;
      case OrderStatus.CANCELLED: return 0;
      default: return 1;
    }
  };

  const currentStep = getStatusStep(currentStatus);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg">Theo Dõi Đơn Hàng</h3>
            <p className="text-sm text-slate-600">Cập nhật trạng thái vận chuyển</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {nextStatus && currentStatus !== OrderStatus.CANCELLED && (
            <button
              onClick={() => handleStatusChange(nextStatus)}
              disabled={isLoading}
              className={`
                inline-flex items-center justify-center gap-2
                px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium text-sm sm:text-base
                transition-all duration-300 ease-in-out
                ${isAnimating ? 'animate-pulse' : ''}
                ${currentStatus === OrderStatus.PENDING ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl' : 
                  currentStatus === OrderStatus.CONFIRMED ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl' :
                  currentStatus === OrderStatus.SHIPPED ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl' : 
                  'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg hover:shadow-xl'}
                disabled:opacity-50 disabled:cursor-not-allowed
                transform hover:-translate-y-0.5 active:translate-y-0
                shadow-lg hover:shadow-xl
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

      {/* Status Display */}
      {currentStatus === OrderStatus.CANCELLED ? (
        <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
          <div className="bg-red-100 p-3 rounded-full">
            <Clock className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-700 text-lg mb-1">Đơn hàng đã bị hủy</h3>
            <p className="text-red-600 text-sm">Đơn hàng này đã được hủy và không thể tiếp tục xử lý</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Progress Bar */}
          <div className="hidden sm:block absolute top-5 left-0 right-0 h-1 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000 ease-in-out"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
          
          {/* Status Steps */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {/* Step 1: Pending */}
            <div className="flex flex-col items-center text-center">
              <div className={`relative w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-500 ${
                currentStep >= 1 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                <Clock size={24} />
                {currentStep > 1 && (
                  <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-white bg-green-500 rounded-full" />
                )}
              </div>
              <div className="space-y-1">
                <div className={`font-medium text-sm ${
                  currentStep >= 1 ? 'text-slate-800' : 'text-slate-500'
                }`}>
                  Chờ xác nhận
                </div>
                <div className="text-xs text-slate-400">
                  Đơn hàng mới
                </div>
              </div>
            </div>
            
            {/* Step 2: Confirmed */}
            <div className="flex flex-col items-center text-center">
              <div className={`relative w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-500 ${
                currentStep >= 2 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                <Package size={24} />
                {currentStep > 2 && (
                  <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-white bg-green-500 rounded-full" />
                )}
              </div>
              <div className="space-y-1">
                <div className={`font-medium text-sm ${
                  currentStep >= 2 ? 'text-slate-800' : 'text-slate-500'
                }`}>
                  Đã xác nhận
                </div>
                <div className="text-xs text-slate-400">
                  Chuẩn bị hàng
                </div>
              </div>
            </div>
            
            {/* Step 3: Shipping */}
            <div className="flex flex-col items-center text-center">
              <div className={`relative w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-500 ${
                currentStep >= 3 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                <Truck size={24} />
                {currentStep > 3 && (
                  <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-white bg-green-500 rounded-full" />
                )}
              </div>
              <div className="space-y-1">
                <div className={`font-medium text-sm ${
                  currentStep >= 3 ? 'text-slate-800' : 'text-slate-500'
                }`}>
                  Đang vận chuyển
                </div>
                <div className="text-xs text-slate-400">
                  Trên đường giao
                </div>
              </div>
            </div>
            
            {/* Step 4: Delivered */}
            <div className="flex flex-col items-center text-center">
              <div className={`relative w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-500 ${
                currentStep >= 4 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                <Home size={24} />
                {currentStep >= 4 && (
                  <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-white bg-green-500 rounded-full" />
                )}
              </div>
              <div className="space-y-1">
                <div className={`font-medium text-sm ${
                  currentStep >= 4 ? 'text-slate-800' : 'text-slate-500'
                }`}>
                  Đã giao hàng
                </div>
                <div className="text-xs text-slate-400">
                  Hoàn thành
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Progress Indicator */}
          <div className="sm:hidden mt-6">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Bước {currentStep}/4</span>
              <span>{Math.round((currentStep / 4) * 100)}% hoàn thành</span>
            </div>
            <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000 ease-in-out"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}