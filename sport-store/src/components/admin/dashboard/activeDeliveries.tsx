import { Clock, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RecentOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  progress: number;
  createdAt: string;
  originAddress: string;
  destinationAddress: string;
  statusHistory: Array<{
    status: string;
    updatedAt: string;
    updatedBy: string;
    note: string;
    _id: string;
  }>;
}

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

  // Chuyển đổi dữ liệu từ API sang định dạng hiển thị
  const mappedDeliveries = deliveries.map(mapToDelivery);

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

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-green-100 text-green-700';
      case 'delivered':
        return 'bg-purple-100 text-purple-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center mr-3">
              <Clock className="text-white" size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Đơn Đang Được Giao</h2>
          </div>
        </div>
        
        <div className="space-y-6">
          {mappedDeliveries.map((delivery) => (
            <div key={delivery.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-gray-900 mr-2">#{delivery.orderNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                      {formatOrderStatus(delivery.status)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center my-4">
                <div className="flex flex-col items-center mr-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div className="w-0.5 h-8 bg-gray-200 my-1"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900">{delivery.originAddress}</p>
                    <p className="text-xs text-gray-500">Điểm xuất phát</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{delivery.destinationAddress}</p>
                    <p className="text-xs text-gray-500">Điểm đến</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-500">Tiến độ</span>
                  <span className="text-xs font-medium text-black">{delivery.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-600 rounded-full transition-all duration-300" 
                    style={{ width: `${delivery.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleViewDetails(delivery.id)}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <span className="mr-1">Chi tiết</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 