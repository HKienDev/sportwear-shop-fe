'use client';

import { useEffect, useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe } from '@/config/stripe';

interface StripePaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

function CheckoutForm({ amount, onSuccess, onError }: Omit<StripePaymentFormProps, 'clientSecret'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required'
      });

      if (error) {
        setErrorMessage(error.message || 'Có lỗi xảy ra trong quá trình thanh toán');
        onError?.(error.message || 'Có lỗi xảy ra trong quá trình thanh toán');
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess?.();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra trong quá trình thanh toán';
      setErrorMessage(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4">
        <PaymentElement />
      </div>
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      <div className="text-right">
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className={`px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed ${
            isLoading ? 'opacity-50' : ''
          }`}
        >
          {isLoading ? 'Đang xử lý...' : `Thanh toán ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}`}
        </button>
      </div>
    </form>
  );
}

export default function StripePaymentForm({ clientSecret, ...props }: StripePaymentFormProps) {
  return (
    <Elements stripe={getStripe()} options={{ clientSecret }}>
      <CheckoutForm {...props} />
    </Elements>
  );
} 