import { Clock, ChevronRight, Truck, MapPin, Package, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { RecentOrder } from '@/types/dashboard';

interface Delivery {
  id: string;
  orderNumber: string;
  status: string;
  progress: number;
  originAddress: string;
  destinationAddress: string;
}

interface ActiveDeliveriesProps {
  deliveries: RecentOrder[];
}

export function ActiveDeliveries({ deliveries }: ActiveDeliveriesProps) {
  const router = useRouter();

  // Hàm chuyển đổi RecentOrder thành Delivery
  const mapToDelivery = (order: RecentOrder): Delivery => {
    // Tính toán tiến độ dựa trên trạng thái
    let progress = 0;
    switch (order.status.toLowerCase()) {
      case 'pending':
        progress = 25;
        break;
      case 'confirmed':
        progress = 50;
        break;
      case 'shipped':
        progress = 75;
        break;
      case 'delivered':
        progress = 100;
        break;
      case 'cancelled':
        progress = 0;
        break;
      default:
        progress = 0;
    }

    return {
      id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      progress: progress,
      originAddress: order.originAddress,
      destinationAddress: order.destinationAddress
    };
  };

  // Chuyển đổi dữ liệu từ API sang định dạng hiển thị và giới hạn tối đa 2 đơn hàng mới nhất
  const mappedDeliveries = deliveries
    .map(mapToDelivery)
    .slice(0, 2); // Chỉ hiển thị 2 đơn hàng mới nhất

  // Hàm xử lý chuyển hướng đến trang chi tiết đơn hàng
  const handleViewDetails = (orderId: string) => {
    router.push(`/admin/orders/details/${orderId}`);
  };

  // Hàm format trạng thái đơn hàng
  const formatOrderStatus = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipped':
        return 'Đang giao';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  // Hàm lấy màu và icon cho trạng thái
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          color: 'from-yellow-500 to-orange-500',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          textColor: 'text-yellow-700 dark:text-yellow-300',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          icon: AlertCircle
        };
      case 'confirmed':
        return {
          color: 'from-blue-500 to-indigo-500',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          textColor: 'text-blue-700 dark:text-blue-300',
          borderColor: 'border-blue-200 dark:border-blue-800',
          icon: CheckCircle
        };
      case 'shipped':
        return {
          color: 'from-emerald-500 to-green-500',
          bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
          textColor: 'text-emerald-700 dark:text-emerald-300',
          borderColor: 'border-emerald-200 dark:border-emerald-800',
          icon: Truck
        };
      case 'delivered':
        return {
          color: 'from-purple-500 to-violet-500',
          bgColor: 'bg-purple-50 dark:bg-purple-900/20',
          textColor: 'text-purple-700 dark:text-purple-300',
          borderColor: 'border-purple-200 dark:border-purple-800',
          icon: CheckCircle
        };
      case 'cancelled':
        return {
          color: 'from-red-500 to-pink-500',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          textColor: 'text-red-700 dark:text-red-300',
          borderColor: 'border-red-200 dark:border-red-800',
          icon: XCircle
        };
      default:
        return {
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          textColor: 'text-gray-700 dark:text-gray-300',
          borderColor: 'border-gray-200 dark:border-gray-800',
          icon: AlertCircle
        };
    }
  };

  return (
    <div className="relative group overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Đơn Đang Được Giao</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">2 đơn hàng mới nhất đang được giao</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {mappedDeliveries.length > 0 ? (
            mappedDeliveries.map((delivery) => {
              const statusConfig = getStatusConfig(delivery.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div 
                  key={delivery.id} 
                  className="group/item relative overflow-hidden bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Status Indicator */}
                  <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${statusConfig.color}`}></div>
                  
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 bg-gradient-to-br ${statusConfig.color} rounded-lg shadow-md`}>
                          <StatusIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                            #{delivery.orderNumber}
                          </h3>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border`}>
                            {formatOrderStatus(delivery.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Delivery Route */}
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="w-0.5 h-8 bg-gradient-to-b from-emerald-200 to-blue-200 dark:from-emerald-700 dark:to-blue-700"></div>
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {delivery.originAddress}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Điểm xuất phát</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {delivery.destinationAddress}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Điểm đến</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Tiến độ giao hàng</span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{delivery.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${statusConfig.color} rounded-full transition-all duration-500 ease-out shadow-sm`}
                          style={{ width: `${delivery.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleViewDetails(delivery.id)}
                        className="group/btn flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      >
                        <span>Chi tiết</span>
                        <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Truck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">Không có đơn hàng đang giao</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Tất cả đơn hàng đã được xử lý</p>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/20 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
} 