'use client';

import { PaymentMethod } from '@/types/order';
import { FaMoneyBillWave } from 'react-icons/fa';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PaymentMethodProps {
  expandedSection: string | null;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  toggleSection: (section: string) => void;
}

const paymentMethods = [
  {
    id: PaymentMethod.COD,
    name: "Thanh toán khi nhận hàng (COD)",
    description: "Thanh toán bằng tiền mặt khi nhận hàng",
    icon: <FaMoneyBillWave className="w-5 h-5 md:w-6 md:h-6" />
  }
];

export default function PaymentMethodComponent({
  expandedSection,
  paymentMethod,
  setPaymentMethod,
  toggleSection
}: PaymentMethodProps) {
  const handlePaymentMethodClick = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div 
        className="flex justify-between items-center cursor-pointer px-4 md:px-6 py-3 md:py-4 bg-gray-50"
        onClick={() => toggleSection('payment')}
      >
        <h2 className="text-base md:text-lg font-semibold text-gray-900">PHƯƠNG THỨC THANH TOÁN</h2>
        {expandedSection === 'payment' ? <ChevronUp className="w-4 h-4 md:w-5 md:h-5" /> : <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />}
      </div>

      {expandedSection === 'payment' && (
        <div className="p-4 md:p-6 border-t border-gray-200">
          <div className="space-y-3 md:space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`flex items-start md:items-center p-3 md:p-4 border rounded-lg cursor-pointer ${
                  paymentMethod === method.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
                onClick={() => handlePaymentMethodClick(method.id)}
              >
                <div className="flex-shrink-0 mr-3 md:mr-4 text-red-500 mt-0.5 md:mt-0">
                  {method.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm md:text-base">{method.name}</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">{method.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 