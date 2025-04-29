import { CreditCard, Package, Truck, Home } from 'lucide-react';

interface StatusHistory {
  status: string;
  updatedAt: string;
  updatedBy: string;
  note: string;
  _id: string;
}

interface OrderStatusTimelineProps {
  currentStatus: string;
  orderDate: Date;
  statusHistory?: StatusHistory[];
}

export default function OrderStatusTimeline({
  currentStatus,
  orderDate,
  statusHistory = []
}: OrderStatusTimelineProps) {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  // Hàm kiểm tra trạng thái đơn hàng
  const isStatusActive = (status: string) => {
    const statusOrder = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const statusIndex = statusOrder.indexOf(status);
    return currentIndex >= statusIndex;
  };

  // Hàm lấy thời gian cập nhật cho mỗi trạng thái
  const getStatusDate = (status: string) => {
    if (!statusHistory || statusHistory.length === 0) {
      // Nếu không có lịch sử, chỉ trả về ngày cho trạng thái hiện tại
      return status === currentStatus ? orderDate : null;
    }
    
    const historyItem = statusHistory.find(item => item.status === status);
    return historyItem ? historyItem.updatedAt : null;
  };

  // Hàm kiểm tra xem trạng thái đã xảy ra chưa
  const hasStatusOccurred = (status: string) => {
    if (status === 'pending') return true; // Trạng thái chờ xác nhận luôn xảy ra
    if (!statusHistory || statusHistory.length === 0) return false;
    return statusHistory.some(item => item.status === status);
  };

  return (
    <div className="px-6 py-5 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between w-full max-w-3xl mx-auto">
        {/* Order pending */}
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isStatusActive('pending') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            <CreditCard size={20} />
          </div>
          <div className="text-xs font-medium mt-2 text-center">Chờ xác nhận</div>
          <div className="text-xs text-gray-500">{formatDate(orderDate)}</div>
        </div>
        
        {/* Processing connector */}
        <div className={`h-1 flex-1 mx-1 ${isStatusActive('confirmed') ? 'bg-green-500' : 'bg-gray-200'}`}></div>
        
        {/* Processing */}
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isStatusActive('confirmed') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            <Package size={20} />
          </div>
          <div className="text-xs font-medium mt-2 text-center">Đã xác nhận</div>
          <div className="text-xs text-gray-500">
            {hasStatusOccurred('confirmed') ? formatDate(getStatusDate('confirmed')!) : 'Chưa xác nhận'}
          </div>
        </div>
        
        {/* Shipping connector */}
        <div className={`h-1 flex-1 mx-1 ${isStatusActive('shipped') ? 'bg-green-500' : 'bg-gray-200'}`}></div>
        
        {/* Shipping */}
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isStatusActive('shipped') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            <Truck size={20} />
          </div>
          <div className="text-xs font-medium mt-2 text-center">Đang vận chuyển</div>
          <div className="text-xs text-gray-500">
            {hasStatusOccurred('shipped') ? formatDate(getStatusDate('shipped')!) : 'Chưa vận chuyển'}
          </div>
        </div>
        
        {/* Delivered connector */}
        <div className={`h-1 flex-1 mx-1 ${isStatusActive('delivered') ? 'bg-green-500' : 'bg-gray-200'}`}></div>
        
        {/* Delivered */}
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isStatusActive('delivered') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            <Home size={20} />
          </div>
          <div className="text-xs font-medium mt-2 text-center">Đã giao</div>
          <div className="text-xs text-gray-500">
            {hasStatusOccurred('delivered') ? formatDate(getStatusDate('delivered')!) : 'Chưa giao'}
          </div>
        </div>
      </div>
    </div>
  );
} 