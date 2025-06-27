'use client';

import { useState } from 'react';
import { PaymentMethod } from '@/types/order';
import { FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import CheckoutStripePayment from './CheckoutStripePayment';

interface PaymentMethodProps {
  amount: number;
  expandedSection: string | null;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  toggleSection: (section: string) => void;
  orderId?: string;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
}

const paymentMethods = [
  {
    id: PaymentMethod.COD,
    name: "Thanh toán khi nhận hàng (COD)",
    description: "Thanh toán bằng tiền mặt khi nhận hàng",
    icon: <FaMoneyBillWave className="w-6 h-6" />
  },
  {
    id: PaymentMethod.STRIPE,
    name: "Thanh toán qua Stripe",
    description: "Thanh toán an toàn qua cổng thanh toán Stripe",
    icon: <FaCreditCard className="w-6 h-6" />
  }
];

export default function PaymentMethodComponent({
  amount,
  expandedSection,
  paymentMethod,
  setPaymentMethod,
  toggleSection,
  orderId,
  onPaymentSuccess,
  onPaymentError
}: PaymentMethodProps) {
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);

  const handlePaymentMethodClick = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === PaymentMethod.STRIPE) {
      handleStripePayment();
    }
  };

  const handleStripePayment = () => {
    if (orderId) {
      setIsStripeModalOpen(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('payment')}
        >
          <h2 className="text-lg font-semibold text-gray-900">PHƯƠNG THỨC THANH TOÁN</h2>
          <span className="text-gray-500">
            {expandedSection === 'payment' ? 'Thu gọn' : 'Mở rộng'}
          </span>
        </div>

        {expandedSection === 'payment' && (
          <div className="mt-4 space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                  paymentMethod === method.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
                onClick={() => handlePaymentMethodClick(method.id)}
              >
                <div className="flex-shrink-0 mr-4 text-red-500">
                  {method.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{method.name}</h3>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {orderId && (
        <CheckoutStripePayment
          isOpen={isStripeModalOpen}
          onClose={() => setIsStripeModalOpen(false)}
          amount={amount}
          onPaymentSuccess={onPaymentSuccess}
          onPaymentError={onPaymentError}
        />
      )}
    </>
  );
} 