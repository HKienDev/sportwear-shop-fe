import { CreditCard, Package, Truck, Home } from 'lucide-react';

interface OrderStatusTimelineProps {
  currentStatus: string;
  orderDate: Date;
  processingDate: Date;
  shippingDate: Date;
  deliveryDate: Date;
}

export default function OrderStatusTimeline({ 
  currentStatus, 
  orderDate, 
  processingDate, 
  shippingDate, 
  deliveryDate 
}: OrderStatusTimelineProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="px-6 py-5 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between w-full max-w-3xl mx-auto">
        {/* Order confirmed */}
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStatus ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            <CreditCard size={20} />
          </div>
          <div className="text-xs font-medium mt-2 text-center">Đã thanh toán</div>
          <div className="text-xs text-gray-500">{formatDate(orderDate)}</div>
        </div>
        
        {/* Processing connector */}
        <div className={`h-1 flex-1 mx-1 ${currentStatus === 'processing' || currentStatus === 'shipping' || currentStatus === 'delivered' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
        
        {/* Processing */}
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStatus === 'processing' || currentStatus === 'shipping' || currentStatus === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            <Package size={20} />
          </div>
          <div className="text-xs font-medium mt-2 text-center">Xử lý</div>
          <div className="text-xs text-gray-500">{formatDate(processingDate)}</div>
        </div>
        
        {/* Shipping connector */}
        <div className={`h-1 flex-1 mx-1 ${currentStatus === 'shipping' || currentStatus === 'delivered' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
        
        {/* Shipping */}
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStatus === 'shipping' || currentStatus === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            <Truck size={20} />
          </div>
          <div className="text-xs font-medium mt-2 text-center">Vận chuyển</div>
          <div className="text-xs text-gray-500">{formatDate(shippingDate)}</div>
        </div>
        
        {/* Delivered connector */}
        <div className={`h-1 flex-1 mx-1 ${currentStatus === 'delivered' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
        
        {/* Delivered */}
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStatus === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            <Home size={20} />
          </div>
          <div className="text-xs font-medium mt-2 text-center">Đã giao</div>
          <div className="text-xs text-gray-500">{formatDate(deliveryDate)}</div>
        </div>
      </div>
    </div>
  );
} 