"use client";
import { useState } from "react";
import OrderHeader from "./OrderHeader";
import { Clock, Package, Truck, Home, Loader2 } from "lucide-react";
import OrderTable from "./OrderTable";

// Định nghĩa trạng thái đơn hàng
enum OrderStatus {
  PENDING = "Chờ Xác Nhận",
  CONFIRMED = "Đã Xác Nhận",
  SHIPPED = "Đang Vận Chuyển",
  DELIVERED = "Giao Thành Công",
}

// Mô tả chi tiết từng trạng thái đơn hàng
const orderStatusInfo = {
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
};

export default function OrderDetails() {
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.PENDING);
  const [isLoading, setIsLoading] = useState(false);
  const statusInfo = orderStatusInfo[status];

  // Chuyển trạng thái đơn hàng
  const handleChangeStatus = () => {
    const nextStatus = statusInfo.nextStatus;
    if (nextStatus) {
      setIsLoading(true);
      // Giả lập thời gian xử lý
      setTimeout(() => {
        setStatus(nextStatus);
        setIsLoading(false);
      }, 800);
    }
  };

  // Tính toán các bước tiến trình
  const steps = Object.values(OrderStatus);
  const currentStepIndex = steps.indexOf(status);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <OrderHeader
        orderId="VJUSPORTRQFZNAE"
        customerId="67cbbe4877860add29894c20"
        lastUpdated="Thứ 7, Ngày 15 Tháng 03 Năm 2025"
        status={status}
        paymentStatus={status === OrderStatus.DELIVERED ? "Đã thanh toán" : "Chưa thanh toán"}
      />

      {/* Delivery Tracking UI - Chuyển từ dọc sang ngang */}
      <div className="mt-8 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Theo Dõi Đơn Hàng</h3>
        
        <div className="relative">
          {/* Horizontal progress line */}
          <div className="absolute top-6 left-0 h-1 bg-gray-200 w-full"></div>
          
          {/* Status steps */}
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const stepInfo = orderStatusInfo[step];
              const StepIcon = stepInfo.icon;
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step} className={`flex flex-col items-center transition-all duration-300 ${isCurrent ? 'scale-105' : ''} w-1/4`}>
                  {/* Status icon */}
                  <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 
                    ${isActive ? stepInfo.bgColor : 'bg-gray-100'} 
                    ${isActive ? stepInfo.borderColor : 'border-gray-200'} 
                    ${isActive ? 'border-2' : 'border'}`}>
                    <StepIcon className={`w-5 h-5 ${isActive ? stepInfo.color : 'text-gray-400'}`} />
                  </div>
                  
                  {/* Status content */}
                  <div className={`mt-3 text-center ${isActive ? '' : 'opacity-60'}`}>
                    <h4 className={`font-medium ${isActive ? stepInfo.color : 'text-gray-500'}`}>{step}</h4>
                    <p className="text-xs text-gray-600 mt-1 max-w-xs mx-auto">{stepInfo.description}</p>
                    
                    {isActive && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-800">{stepInfo.date}</p>
                        <p className="text-xs text-gray-500">{stepInfo.time}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Action button container - Centered below status */}
                  {isCurrent && stepInfo.nextStatus && (
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={handleChangeStatus}
                        disabled={isLoading}
                        className={`px-3 py-1 text-xs text-white font-medium rounded-md transition-all duration-200 flex items-center ${stepInfo.buttonColor}`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            <span>Đang xử lý...</span>
                          </>
                        ) : (
                          <>
                            <span>{stepInfo.buttonText}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-gray-800 font-medium flex items-center mb-3">
            <Home className="h-4 w-4 mr-2 text-gray-500" />
            Địa Chỉ Giao Hàng
          </h3>
          <div className="text-gray-600">
            <p className="font-medium">Hoàng Kiên</p>
            <p>Số 94, Đường Phú Mỹ, Thôn Phú Mỹ</p>
            <p>Phường Mỹ Đình 2, Quận Nam Từ Liêm, Thành phố Hà Nội</p>
            <p className="mt-2">Điện thoại: 0362195258</p>
          </div>
        </div>
        
        {/* Shipping Method */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-gray-800 font-medium flex items-center mb-3">
            <Truck className="h-4 w-4 mr-2 text-gray-500" />
            Phương Thức Vận Chuyển
          </h3>
          <div className="text-gray-600">
            <p className="font-medium">Giao hàng nhanh</p>
            <p>Dự kiến giao hàng: 15/03/2025 - 17/03/2025</p>
            <p className="mt-2">Đơn vị vận chuyển: Viettel Post</p>
            <p>Mã vận đơn: <span className="font-medium text-blue-600">VJUSPORTRQFZNAE</span></p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <OrderTable />
    </div>
  );
}