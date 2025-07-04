'use client';

import { Truck, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { ShippingMethod } from '@/types/order';

// Interface cho shipping fee
export interface ShippingFee {
  method: ShippingMethod;
  fee: number;
  description: string;
  estimatedTime: string;
  carrier: string;
}

// Danh sách shipping fees
export const SHIPPING_FEES: ShippingFee[] = [
  {
    method: ShippingMethod.STANDARD,
    fee: 30000,
    description: 'Giao hàng trong 3-5 ngày làm việc',
    estimatedTime: '3-5 ngày',
    carrier: 'Viettel Post'
  },
  {
    method: ShippingMethod.EXPRESS,
    fee: 45000,
    description: 'Giao hàng trong 1-2 ngày làm việc',
    estimatedTime: '1-2 ngày',
    carrier: 'Giao Hàng Nhanh'
  },
  {
    method: ShippingMethod.SAME_DAY,
    fee: 60000,
    description: 'Giao hàng trong ngày',
    estimatedTime: '24 giờ',
    carrier: 'Giao Hàng Tiết Kiệm'
  }
];

interface DeliveryMethodProps {
  expandedSection: string | null;
  deliveryMethod: ShippingMethod;
  setDeliveryMethod: (method: ShippingMethod) => void;
  toggleSection: (section: string) => void;
  formatPrice: (price: number) => string;
}

export default function DeliveryMethod({
  expandedSection,
  deliveryMethod,
  setDeliveryMethod,
  toggleSection,
  formatPrice
}: DeliveryMethodProps) {
  // Tính ngày giao hàng dựa vào phương thức
  const getDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    
    switch (deliveryMethod) {
      case ShippingMethod.SAME_DAY:
        // Giao trong ngày
        return today;
      case ShippingMethod.EXPRESS:
        // Giao trong 1-2 ngày
        deliveryDate.setDate(today.getDate() + 2);
        break;
      case ShippingMethod.STANDARD:
      default:
        // Giao trong 3-5 ngày
        deliveryDate.setDate(today.getDate() + 5);
        break;
    }
    
    return deliveryDate;
  };

  // Format ngày giao hàng
  const formatDeliveryDate = (date: Date) => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayName = days[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${dayName}, ${day}/${month}/${year}`;
  };

  // Lấy thông tin giao hàng hiện tại
  const currentShipping = SHIPPING_FEES.find(fee => fee.method === deliveryMethod) || SHIPPING_FEES[0];
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div 
        className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 cursor-pointer bg-gray-50"
        onClick={() => toggleSection('delivery')}
      >
        <div className="flex items-center space-x-2 md:space-x-3">
          <Truck className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
          <h2 className="text-base md:text-lg font-semibold text-gray-900">HÌNH THỨC GIAO HÀNG</h2>
        </div>
        {expandedSection === 'delivery' ? <ChevronUp className="w-4 h-4 md:w-5 md:h-5" /> : <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />}
      </div>
      
      {expandedSection === 'delivery' && (
        <div className="p-4 md:p-6 border-t border-gray-200">
          <div className="space-y-3 md:space-y-4">
            {SHIPPING_FEES.map((shipping) => (
              <label 
                key={shipping.method}
                className={`flex items-start md:items-center p-3 md:p-4 ${
                  deliveryMethod === shipping.method 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'border border-gray-200'
                } rounded-lg cursor-pointer`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value={shipping.method}
                  checked={deliveryMethod === shipping.method}
                  onChange={() => setDeliveryMethod(shipping.method)}
                  className="h-4 w-4 md:h-5 md:w-5 text-red-600 mt-1 md:mt-0"
                />
                <div className="ml-3 md:ml-4 flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
                    <span className="font-medium text-gray-900 text-sm md:text-base">
                      {shipping.method === ShippingMethod.STANDARD && 'GIAO HÀNG TIẾT KIỆM'}
                      {shipping.method === ShippingMethod.EXPRESS && 'GIAO HÀNG NHANH'}
                      {shipping.method === ShippingMethod.SAME_DAY && 'GIAO HÀNG HỎA TỐC'}
                    </span>
                    <span className="text-gray-700 text-sm md:text-base md:ml-auto">{formatPrice(shipping.fee)}</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">{shipping.description}</p>
                </div>
              </label>
            ))}
          </div>
          
          <div className="mt-4 md:mt-6 bg-green-50 p-3 md:p-4 rounded-lg border border-green-200">
            <div className="flex items-start md:items-center">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-green-600 mt-0.5 md:mt-0 flex-shrink-0" />
              <div className="ml-2 md:ml-2">
                <p className="text-xs md:text-sm text-green-800">
                  Giao hàng vào lúc: <span className="font-semibold">{formatDeliveryDate(getDeliveryDate())}</span>
                </p>
                <div className="mt-1 md:mt-2 text-xs md:text-sm text-green-800">
                  Được giao bởi {currentShipping.carrier}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 