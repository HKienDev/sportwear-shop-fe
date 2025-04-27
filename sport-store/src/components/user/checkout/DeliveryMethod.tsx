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
        className="flex items-center justify-between px-6 py-4 cursor-pointer bg-gray-50"
        onClick={() => toggleSection('delivery')}
      >
        <div className="flex items-center space-x-3">
          <Truck className="w-6 h-6 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900">HÌNH THỨC GIAO HÀNG</h2>
        </div>
        {expandedSection === 'delivery' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </div>
      
      {expandedSection === 'delivery' && (
        <div className="p-6 border-t border-gray-200">
          <div className="space-y-4">
            {SHIPPING_FEES.map((shipping) => (
              <label 
                key={shipping.method}
                className={`flex items-center p-4 ${
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
                  className="h-5 w-5 text-red-600"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">
                      {shipping.method === ShippingMethod.STANDARD && 'GIAO HÀNG TIẾT KIỆM'}
                      {shipping.method === ShippingMethod.EXPRESS && 'GIAO HÀNG NHANH'}
                      {shipping.method === ShippingMethod.SAME_DAY && 'GIAO HÀNG HỎA TỐC'}
                    </span>
                    <span className="ml-auto text-gray-700">{formatPrice(shipping.fee)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{shipping.description}</p>
                </div>
              </label>
            ))}
          </div>
          
          <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-green-600" />
              <p className="ml-2 text-sm text-green-800">
                Giao hàng vào lúc: <span className="font-semibold">{formatDeliveryDate(getDeliveryDate())}</span>
              </p>
            </div>
            <div className="mt-2 text-sm text-green-800">
              Được giao bởi {currentShipping.carrier}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 