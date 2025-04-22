import { Clock, Filter, ChevronRight, ArrowRight } from 'lucide-react';

interface Delivery {
  id: string;
  from: string;
  to: string;
  status: string;
  eta: string;
  progress: number;
}

interface ActiveDeliveriesProps {
  deliveries: Delivery[];
}

export function ActiveDeliveries({ deliveries }: ActiveDeliveriesProps) {
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
          <div className="flex items-center">
            <span className="mr-2 text-xs font-medium text-gray-500">Đang giao: {deliveries.length}/15</span>
            <button className="flex items-center text-gray-700 hover:text-red-600 transition-colors">
              <Filter size={16} className="mr-1" />
              <span className="text-sm">Lọc</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          {deliveries.map((delivery, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-gray-900 mr-2">{delivery.id}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">{delivery.status}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">ETA: {delivery.eta}</p>
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
                    <p className="text-sm font-medium text-gray-900">{delivery.from}</p>
                    <p className="text-xs text-gray-500">Điểm xuất phát</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{delivery.to}</p>
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
                    className="h-full bg-red-600 rounded-full" 
                    style={{ width: `${delivery.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button className="text-red-600 text-sm font-medium flex items-center hover:text-red-800 transition-colors">
                  Chi tiết
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <button className="text-white font-medium px-4 py-2 bg-black rounded-lg hover:bg-gray-800 transition-colors flex items-center mx-auto">
            Xem tất cả đơn hàng
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
} 