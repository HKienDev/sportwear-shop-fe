'use client';

import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { getStripe } from '@/config/stripe';

interface StripePaymentProps {
  orderId: string;
}

export default function StripePayment({ orderId }: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Có lỗi xảy ra khi tạo yêu cầu thanh toán');
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [orderId]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  if (loading) {
    return <div className="text-center py-4">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      {clientSecret && (
        <Elements options={options} stripe={getStripe()}>
          <CheckoutForm amount={0} />
        </Elements>
      )}
    </div>
  );
} 